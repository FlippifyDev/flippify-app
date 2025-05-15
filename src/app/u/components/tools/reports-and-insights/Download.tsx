"use client"

// Local Imports
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { IListing, IOrder } from '@/models/store-data';
import { retrieveUserInventory } from '@/services/firebase/retrieve';
import { formatSalesForCSVExport, formatCOGSForCSVExport, formatInventoryForCSVExport, formatRefundsForCSVExport } from '@/utils/format';

// External Imports
import React, { useEffect, useState } from 'react'
import { HiOutlineDownload } from "react-icons/hi";
import { useSession } from 'next-auth/react';
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { fetchUserStores } from '@/utils/extract-user-data';


interface IDownloadProps {
    orders: IOrder[];
    timeFrom: string;
    timeTo: string;
}

const Download: React.FC<IDownloadProps> = ({ orders, timeFrom, timeTo }) => {
    const { data: session } = useSession()

    const [inventory, setInventory] = useState<IListing[]>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!session) return;

            const storeTypes = fetchUserStores(session.user);

            const inventoryResults = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserInventory({
                        uid: session.user.id as string,
                        timeFrom: timeFrom,
                        timeTo: timeTo,
                        storeType,
                    }).then((inventory) => [storeType, inventory] as const);
                })
            );
            const inventory = inventoryResults[inventoryResults.length - 1]?.[1] ?? [];

            setInventory(inventory);
        };

        if (session?.user.authentication?.subscribed) {
            fetchInventory();
        }
    }, [session, session?.user.id, timeFrom, timeTo, session?.user.authentication?.subscribed])

    const handleDownload = async () => {
        setLoading(true);

        const exports = [
            { content: formatSalesForCSVExport(orders, timeFrom, timeTo), name: 'sales' },
            { content: formatCOGSForCSVExport(orders, timeFrom, timeTo), name: 'cogs' },
            { content: formatInventoryForCSVExport(inventory ?? [], timeFrom, timeTo), name: 'inventory' },
            { content: formatRefundsForCSVExport(inventory ?? [], timeFrom, timeTo), name: 'refunds' },
        ].filter((x) => x.content);

        if (exports.length === 0) {
            alert("No data to export for that period.");
            return;
        }


        // 3) Build the zip
        const zip = new JSZip();
        const today = new Date().toISOString().split("T")[0];
        exports.forEach(({ content, name }) => {
            zip.file(`flippify-${name}-${today}.csv`, content!);
        });

        // 4) Generate and download
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, `flippify-report-${today}.zip`);
        setLoading(false);
    };

    return (
        <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-1 max-w-md p-2 rounded-lg bg-houseFinancialHub text-white text-sm"
        >
            {loading && (
                <LoadingSpinner />
            )}
            {!loading && (
                <>
                    <HiOutlineDownload className="h-5 w-5 sm:h-4 sm:w-4" />
                    <span className="text-sm hidden sm:block">Download</span>
                </>
            )}
        </button>
    );
};

export default Download;
