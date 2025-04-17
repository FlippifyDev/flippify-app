"use client";

// Local Imports
import Alert from "@/app/components/Alert";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { shortenText } from "@/utils/format";
import NewEbayOrderForm from "../navbar-tools/NewEbayOrder";
import UpdateTableField from "./UpdateTableField";
import { formatTableDate } from "@/utils/format-dates";
import { currencySymbols } from "@/config/currency-config";
import { IEbayInventoryItem } from "@/models/store-data";
import { retrieveUserInventory } from "@/services/firebase/retrieve";
import { defaultTimeFrom, ebayInventoryCacheKey } from "@/utils/constants";

// External Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";


const Inventory = () => {
    const { data: session } = useSession();
     const cacheKey = `${ebayInventoryCacheKey}-${session?.user.id}`;

    const currency = session?.user.preferences.currency || "USD";
    const [addNewOrderModalOpen, setAddNewOrderModalOpen] = useState(false);

    const [fillItem, setFillItem] = useState<IEbayInventoryItem>();

    const [listedData, setListedData] = useState<IEbayInventoryItem[]>([]);

    // Page Config
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(listedData.length / itemsPerPage);

    const paginatedData = listedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInventoryData = async () => {
            setLoading(true);
            const inventory = await retrieveUserInventory(
                session?.user.id as string,
                defaultTimeFrom,
                session?.user.connectedAccounts.ebay?.ebayAccessToken as string,
            );
            if (inventory) {
                setListedData(inventory);
            }
            setLoading(false);
        };

        if (session?.user.authentication.subscribed && triggerUpdate) {
            fetchInventoryData();
            setTriggerUpdate(false);
        }
    }, [session?.user, triggerUpdate]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    function handleDisplayModal(item: IEbayInventoryItem) {
        setFillItem(item);
        setAddNewOrderModalOpen(true);
    }

    return (
        <div className="w-full h-full overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th></th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Purchase Platform</th>
                        <th>Cost ({currencySymbols[currency]})</th>
                        <th>Listed Price ({currencySymbols[currency]})</th>
                        <th>Date Listed</th>
                        <th>Custom Tag</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => {
                            const { purchase, customTag } = item;
                            let purchasePrice = purchase?.price !== undefined ? purchase.price?.toFixed(2) : "0";
                            if (purchasePrice === undefined) {
                                purchasePrice = "0";
                            }
                            return (
                                <tr
                                    key={index}
                                    className="cursor-pointer hover:bg-gray-100 transition duration-100"
                                >
                                    <td
                                        onClick={() => handleDisplayModal(item)}
                                        className="min-w-20">
                                        <Image
                                            src={item.image[0]}
                                            width={100}
                                            height={100}
                                            alt={"image"}
                                            loading="lazy"
                                            className="rounded-full w-12 h-12"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </td>
                                    <td onClick={() => handleDisplayModal(item)}>{shortenText(item.name)}</td>
                                    <td onClick={() => handleDisplayModal(item)}>{item.quantity}</td>
                                    <UpdateTableField currentValue={purchase?.platform} docId={item.itemId} item={item} docType='inventory' storeType='ebay' keyType="purchase.platform" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <UpdateTableField currentValue={purchase?.price?.toFixed(2)} docId={item.itemId} item={item} docType='inventory' storeType='ebay' keyType="purchase.price" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                    <td onClick={() => handleDisplayModal(item)}>
                                        {item.price.toFixed(2)}
                                    </td>
                                    <td className="min-w-32" onClick={() => handleDisplayModal(item)}>{formatTableDate(item.dateListed)}</td>
                                    <UpdateTableField currentValue={customTag} docId={item.itemId} item={item} docType='inventory' storeType='ebay' keyType="customTag" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? <LoadingSpinner /> : "No inventory available."}
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="fixed bottom-0 right-0 p-2">
                    <div className="flex flex-col items-center">
                        {/* Pagination Buttons */}
                        <div className="inline-flex mt-2 xs:mt-0">
                            {/* Prev Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`flex items-center justify-center px-5 h-12 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-s`}
                            >
                                Prev
                            </button>
                            {/* Show entries info dynamically */}
                            <div className="flex items-center bg-gray-900 justify-center px-4 h-12 text-sm text-white space-x-1">
                                <span className="font-semibold text-white">
                                    {Math.min((currentPage - 1) * itemsPerPage + 1, listedData.length)}
                                </span>
                                <span>-</span>
                                <span className="font-semibold text-white">
                                    {Math.min(currentPage * itemsPerPage, paginatedData.length)}
                                </span>
                                <span>of</span>
                                <span className="font-semibold text-white">{paginatedData.length}</span>
                            </div>
                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`flex items-center justify-center px-5 h-12 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-e`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {addNewOrderModalOpen && (
                <NewEbayOrderForm fillItem={fillItem} setDisplayModal={setAddNewOrderModalOpen} />
            )}
        </div>
    );
};

export default Inventory;