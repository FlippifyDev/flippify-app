"use client"

// Local Imports
import Modal from '../../dom/ui/Modal'
import Dropdown from '../../dom/ui/Dropdown';

// External Imports
import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { IListing, IOrder, IPurchase, ISale, IShipping, OrderStatus, StoreType } from '@/models/store-data';
import { formatDateToISO } from '@/utils/format-dates';
import { useSession } from 'next-auth/react';
import { generateRandomFlippifyListingId, generateRandomFlippifyOrderId } from '@/utils/generate-random';
import { fetchSubscriptionMaxListings, fetchUserInventoryAndOrdersCount, fetchUserSubscription } from '@/utils/extract-user-data';
import { createNewOrderItemAdmin } from '@/services/firebase/create-admin';
import { ISubscription } from '@/models/user';
import { shortenText } from '@/utils/format';
import { inventoryCacheKey, orderCacheKey } from '@/utils/constants';
import { addCacheData, getCachedData } from '@/utils/cache-helpers';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Link from 'next/link';

interface UploadOrdersProps {
    setDisplayModal: (value: boolean) => void;
}

const UploadOrders: React.FC<UploadOrdersProps> = ({ setDisplayModal }) => {
    const { data: session, update: updateSession } = useSession();
    const [message, setMessage] = useState<string>();

    const { manualOrders } = fetchUserInventoryAndOrdersCount(session?.user);

    const userSubscription = fetchUserSubscription(session?.user.subscriptions ?? []);
    const { manual: maxManual } = fetchSubscriptionMaxListings(userSubscription as ISubscription);

    const [uploadType, setUploadType] = useState<string>("custom");
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File>();

    const uploadErrors = [] as string[];

    const storeOptions = [
        { label: "Custom", value: "custom" },
    ];

    function onStoreTypeChange(value: string) {
        setUploadType(value);
    }


    const transformRowToOrder = (row: Record<string, string>): { order?: IOrder, error?: string } => {
        if (!row["Title"] || !row["Transaction ID"] || !row["Sale Date"]) return {};
        if (uploadType === "custom" && !row["Sale Marketplace"]) return {}

        const purchaseDate = row["Purchase Date"] ? formatDateToISO(new Date(row["Purchase Date"])) : null;
        const saleDate = row["Sale Date"] ? formatDateToISO(new Date(row["Sale Date"])) : null;
        const listingDate = row["Listing Date"] ? formatDateToISO(new Date(row["Listing Date"])) : null;

        if (saleDate?.includes("NaN")) {
            return { error: `Transaction ID -> ${row["Transaction ID"]} | Invalid sale date | ${row["Sale Date"]} interpreted as ${saleDate}` };
        };

        const currency = session?.user.preferences?.currency

        const sale: ISale = {
            price: row["Sale Price"] ? parseFloat(row["Sale Price"]) : null,
            quantity: row["Sale Quantity"] ? parseInt(row["Sale Quantity"], 10) : 1,
            date: saleDate || null,
            platform: row["Sale Marketplace"] || null,
            currency: row["Sale Currency"] || currency,
            buyerUsername: null,
        };
        const purchase: IPurchase = {
            price: row["Purchase Price"] ? parseFloat(row["Purchase Price"]) : null,
            quantity: row["Purchase Quantity"] ? parseInt(row["Purchase Quantity"], 10) : 1,
            date: purchaseDate || null,
            platform: row["Purchase Marketplace"] || null,
            currency: row["Purchase Currency"] || currency,
        };
        const shipping: IShipping = {
            fees: row["Shipping Fees"] ? parseFloat(row["Shipping Fees"]) : null,
            service: row["Shipping Service"] || null,
            paymentToShipped: null,
            timeDays: null,
            trackingNumber: null,
        };

        const order: IOrder = {
            name: row["Title"],
            itemId: row["Item ID"] || generateRandomFlippifyListingId(20),
            transactionId: row["Transaction ID"],
            orderId: row["Order ID"] || generateRandomFlippifyOrderId(20),
            listingDate: listingDate || null,
            storeType: row["Sale Marketplace"].toLowerCase() || uploadType.toLowerCase(),
            status: row["Sale Status"] as OrderStatus || "Completed",
            additionalFees: row["Additional Fees"] ? parseFloat(row["Additional Fees"]) : null,
            customTag: row["Custom Tag"] || null,
            sale,
            purchase,
            shipping,
            refund: null,
            history: null,
            image: null,
            lastModified: new Date().toISOString(),
            recordType: "manual",
        };

        return { order: order };
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const chosenFile = e.target.files?.[0]
        setFile(chosenFile);
    }

    
    async function handleCacheAndSessionUpdate(orderItems: IOrder[]) {
        if (!session) return;

        const orderCache = `${orderCacheKey}-${session.user.id}`;

        // Add multiple order items to cache
        orderItems.forEach(item => addCacheData(orderCache, item));

        // Dynamically update counts per store type
        const updatedStore = { ...session.user.store };

        // Group items by storeType
        const countsByStore: Record<string, number> = {};
        orderItems.forEach(item => {
            if (!item.storeType) return;
            countsByStore[item.storeType] = (countsByStore[item.storeType] || 0) + 1;
        });

        Object.entries(countsByStore).forEach(([storeType, count]) => {
            const current = session.user.store?.[storeType] || {};
            const manual = current.numOrders?.manual ?? 0;
            const totalManual = current.numOrders?.totalManual ?? 0;
            updatedStore[storeType] = {
                ...current,
                numOrders: {
                    ...current.numOrders,
                    manual: manual + count,
                    totalManual: totalManual + count,
                },
            };
        });

        // Commit session update
        await updateSession({
            ...session,
            user: {
                ...session.user,
                store: updatedStore,
            },
        });
    }


    const handleFileUpload = () => {
        if (!file) return;
        setUploading(true);

        Papa.parse<Record<string, string>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async ({ data }) => {
                const orders = data.map(transformRowToOrder);
                let count = 0;
                try {
                    const ordersToAddToSession = [];
                    for (const orderDict of orders) {
                        if (count + manualOrders >= maxManual) return;

                        if (!orderDict.order || orderDict.error) {
                            uploadErrors.push(orderDict.error ?? `Uncaught error`);
                            continue
                        }

                        const order = orderDict.order;

                        const { success, error, orderExists } = await createNewOrderItemAdmin(session?.user.id as string, order.storeType as StoreType, order);
                        if (!success) {
                            console.error('Order upload failed', { order, error, orderExists });
                        } else {
                            count += 1
                            ordersToAddToSession.push(order)
                        }
                    }
                    await handleCacheAndSessionUpdate(ordersToAddToSession)
                    setUploaded(true);
                    setMessage(`Uploaded ${count} of ${orders.length}`)
                } catch (err) {
                    console.error(err);
                }
            },
            error: (err) => {
                console.error('CSV parse error:', err);
            },
        });

        setUploading(false);
    };


    return (
        <Modal title="Upload Sales" className="relative max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            <div className='flex flex-col gap-4'>
                <div className='w-full flex flex-row justify-between items-center'>
                    <div>
                        <Dropdown
                            value={uploadType}
                            onChange={onStoreTypeChange}
                            options={storeOptions}
                        />
                    </div>

                    {/* Hidden file input for CSV import */}
                    <div>
                        <label className="block bg-gray-800 px-4 py-3 rounded-lg text-white text-center text-sm text-nowrap hover:cursor-pointer">
                            {file?.name ? shortenText(file.name, 7) : "Select CSV"}
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>
                </div>
                <hr />
                <div className='w-full flex items-center justify-between'>
                    <div className='text-sm'>
                        View required <Link href={`/l/blog/how-to-upload-sales#${uploadType}`} target="_blank" className='text-blue-500 hover:underline'>format</Link>
                    </div>
                    {/* Button to trigger CSV import */}
                    <button
                        type="button"
                        onClick={handleFileUpload}
                        disabled={uploaded || uploading}
                        className={`${uploaded ? "bg-muted" : "bg-houseBlue hover:bg-houseHoverBlue"} min-w-24 px-4 py-2 flex justify-center text-white text-sm rounded-lg transition text-nowrap`}
                    >
                        {!uploading ? "Upload" : <LoadingSpinner />}
                    </button>
                </div>
            </div>

            {message && (
                <hr className='my-4' />
            )}
            <p className={`${uploaded ? "text-green-500" : "text-red-500"} text-sm`}>{message}</p>

            {uploadErrors.length > 0 && (
                <>
                    <hr className='my-4' />
                    <div className='bg-gray-100 p-4 rounded-lg space-y-2'>
                        {uploadErrors.map((err, idx) => (
                            <p key={idx} className="text-red-600 text-sm">{err}</p>
                        ))}
                        <p className="text-red-600 text-sm">Test 1</p>
                        <p className="text-red-600 text-sm">Test 2</p>

                    </div>
                </>
            )}

        </Modal >

    )
}

export default UploadOrders;
