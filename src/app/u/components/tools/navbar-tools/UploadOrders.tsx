"use client"

// Local Imports
import Modal from '../../dom/ui/Modal'
import Dropdown from '../../dom/ui/Dropdown';
import { ordersCol } from '@/services/firebase/constants';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { shortenText } from '@/utils/format';
import { addCacheData } from '@/utils/cache-helpers';
import { formatDateToISO } from '@/utils/format-dates';
import { retrieveIdToken } from '@/services/firebase/retrieve';
import { createItemsBatch } from '@/services/firebase/admin-create';
import { ItemType, SubColType } from '@/services/firebase/models';
import { fetchUserInventoryAndOrdersCount } from '@/utils/extract-user-data';
import { IOrder, IPurchase, ISale, IShipping, OrderStatus } from '@/models/store-data';
import { importCSVAllowedSubscriptionPlans, orderCacheKey, subscriptionLimits } from '@/utils/constants';
import { generateRandomFlippifyListingId, generateRandomFlippifyOrderId, generateRandomFlippifyTransactionId } from '@/utils/generate-random';

// External Imports
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Papa from 'papaparse';
import Button from '../../dom/ui/Button';


interface UploadOrdersProps {
    setDisplayModal: (value: boolean) => void;
    handleDisplayModal: (display: boolean, type: string) => void;
}

const UploadOrders: React.FC<UploadOrdersProps> = ({ setDisplayModal, handleDisplayModal }) => {
    const { data: session, update: updateSession } = useSession();
    const [message, setMessage] = useState<string>();
    const subscribed = session?.user.authentication?.subscribed;
    const plan = session?.user.authentication?.subscribed;
    const lastUploaded = session?.user.store?.numOrders?.lastUploaded;

    const [uploadType, setUploadType] = useState<string>("custom");
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const uploadLimit = subscriptionLimits[plan!]["upload-limit"];

    const [aboveLimit, setAboveLimit] = useState(false);
    const [uploadLater, setUploadLater] = useState(false);

    // Messages
    const [errorMessage, setErrorMessage] = useState<string>("")


    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File>();

    const uploadErrors = [] as string[];

    const storeOptions = [
        { label: "Custom", value: "custom" },
    ];

    const uploadOptions = [
        { label: "Sales", value: "upload-orders" },
        { label: "Inventory", value: "upload-inventory" },
    ];

    function onStoreTypeChange(value: string) {
        setUploadType(value);
    }

    function handleUploadSwitch(value: string) {
        handleDisplayModal(true, value);
    }

    useEffect(() => {
        const checkLimit = () => {
            if (!plan) {
                setErrorMessage("Please subscribe to a plan to add orders.");
                setAboveLimit(true);
                return;
            }
            const count = fetchUserInventoryAndOrdersCount(session.user);
            if (plan === "free" && count.manualOrders >= subscriptionLimits[plan].manual) {
                setErrorMessage(`You have reached the maximum number of manual orders for your plan. Please upgrade your plan to add more or wait till next month.`);
                setAboveLimit(true);
                return;
            }


            if (lastUploaded) {
                const last = new Date(lastUploaded).getTime();
                const now = Date.now();
                const hoursSince = (now - last) / (1000 * 60 * 60);
                if (hoursSince < 24) {
                    const hoursLeft = Math.ceil(24 - hoursSince);
                    setErrorMessage(`Next upload in ${hoursLeft} hour(s)`);
                    setUploadLater(true);
                    return;
                }
              }

            setAboveLimit(false);
        };

        if (session?.user) checkLimit();
    }, [session?.user, plan, lastUploaded]);


    const transformRowToOrder = (row: Record<string, string>): { order?: IOrder, error?: string } => {
        if (!row["Title"]) return {};
        if (uploadType === "custom" && !row["Sale Marketplace"]) return {}

        const purchaseDate = row["Purchase Date"] ? formatDateToISO(new Date(row["Purchase Date"]), true) : null;
        const saleDate = row["Sale Date"] ? formatDateToISO(new Date(row["Sale Date"]), true) : formatDateToISO(new Date());
        const listingDate = row["Listing Date"] ? formatDateToISO(new Date(row["Listing Date"]), true) : null;

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
            transactionId: row["Transaction ID"] || generateRandomFlippifyTransactionId(20),
            orderId: row["Order ID"] || generateRandomFlippifyOrderId(20),
            listingDate: listingDate || null,
            storeType: row["Sale Marketplace"].toLowerCase(),
            status: row["Sale Status"] as OrderStatus || "Completed",
            additionalFees: row["Additional Fees"] ? parseFloat(row["Additional Fees"]) : null,
            customTag: row["Custom Tag"] || null,
            createdAt: formatDateToISO(new Date()),
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

        orderItems.forEach(item => addCacheData(orderCache, { [item.transactionId as string]: item }));

        const count = orderItems.length;

        const manual = session.user.store?.numOrders?.manual ?? 0;
        const totalManual = session.user.store?.numOrders?.totalManual ?? 0;

        const updatedNumOrders = {
            ...session.user.store?.numOrders,
            manual: manual + count,
            totalManual: totalManual + count,
        };

        // Commit session update
        await updateSession({
            ...session,
            user: {
                ...session.user,
                numOrders: updatedNumOrders,
            },
        });
    }


    const handleFileUpload = () => {
        if (!file || uploadLater) return;
        setUploading(true);

        Papa.parse<Record<string, string>>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async ({ data }) => {
                try {
                    // 1. Transform & limit
                    const allOrders = data.map(transformRowToOrder);
                    const idToken = await retrieveIdToken();
                    if (!idToken) throw new Error("Not authenticated");

                    // 2. Filter valid & enforce plan limit
                    const validOrders = allOrders
                        .filter(r => r.order && !r.error)
                        .map(r => r.order!)   // now guaranteed ItemType
                        .slice(0, uploadLimit);

                    // 3. Group by subCol (storeType)
                    const byStore: Record<string, ItemType[]> = {};
                    validOrders.forEach(order => {
                        const sub = order.storeType as SubColType;
                        byStore[sub] = byStore[sub] || [];
                        byStore[sub].push(order);
                    });

                    // 4. For each group, fire a batch
                    let totalUploaded = 0;
                    const batchErrors: any[] = [];
                    await Promise.all(
                        Object.entries(byStore).map(async ([subCol, items]) => {
                            const { successCount, errors } = await createItemsBatch({
                                idToken,
                                rootCol: ordersCol,
                                subCol: subCol as SubColType,
                                items,
                            });
                            totalUploaded += successCount;
                            batchErrors.push(...errors);
                        })
                    );

                    // 5. Update session/cache & UI
                    await handleCacheAndSessionUpdate(validOrders.slice(0, totalUploaded));
                    setUploaded(true);
                    setMessage(
                        `Uploaded ${totalUploaded} of ${allOrders.length}.` +
                        (batchErrors.length
                            ? ` ${batchErrors.length} failed.`
                            : "")
                    );
                } catch (err) {
                    console.error("Bulk upload failed", err);
                    setMessage("Bulk upload encountered an error. See console.");
                } finally {
                    setUploading(false);
                }
            },
            error: err => {
                console.error("CSV parse error:", err);
                setUploading(false);
            },
        });
    };


    return (
        <Modal title="Upload Sales" className="relative max-w-[21rem] sm:max-w-xl flex-grow" setDisplayModal={setDisplayModal}>
            {subscribed && importCSVAllowedSubscriptionPlans.includes(subscribed) ? (
                <>
                    {aboveLimit && (
                        <div className="text-center">
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {!aboveLimit && (
                        <>
                            <div className='flex flex-col gap-4'>
                                <div className='w-full flex flex-row justify-between items-center'>
                                    <div>
                                        <Dropdown
                                            value="upload-orders"
                                            onChange={handleUploadSwitch}
                                            options={uploadOptions}
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
                                                disabled={uploadLater}
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <p className='text-xs ml-1 text-gray-500'>Limit is {uploadLimit} items & 1 upload per day</p>
                                </div>
                                <hr />
                                <div className='w-full flex items-end justify-between'>
                                    <div className='text-sm'>
                                        View required <Link href={`/l/blog/how-to-upload-sales#${uploadType}`} target="_blank" className='text-blue-500 hover:underline'>format</Link>
                                    </div>
                                    {/* Button to trigger CSV import */}
                                    <Button
                                        type="button"
                                        onClick={handleFileUpload}
                                        text={uploadLater ? errorMessage : !uploading ? "Upload" : "Uploading..."}
                                        disabled={uploaded || uploading || uploadLater}
                                    />
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
                        </>
                    )}
                </>
            ) : (
                <div className="text-center space-y-4 flex flex-col items-center">
                    <p className="text-sm text-center">You need a paid subscription to import data</p>
                    <p className="text-sm text-center">Please upgrade your plan to access this feature</p>
                    <Link href={`/u/${session?.user.username}/plans`} className="bg-houseBlue max-w-[120px] p-3 hover:bg-houseHoverBlue transition duraction-200 text-white text-sm rounded-lg">
                        Upgrade Plan
                    </Link>
                </div>
            )}

        </Modal >

    )
}

export default UploadOrders;
