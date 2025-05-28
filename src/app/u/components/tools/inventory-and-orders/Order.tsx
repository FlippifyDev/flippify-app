"use client"

// Local Imports
import { IOrder, StoreType } from '@/models/store-data';
import IconButton from '../../dom/ui/IconButton';
import ImageModal from '@/app/components/ImageModal';
import ImageUpload from '../../dom/ui/ImageUpload';
import { firestore } from '@/lib/firebase/config';
import { deleteItem } from '@/services/firebase/delete';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import UpdateTableField from './UpdateTableField';
import { orderCacheKey } from '@/utils/constants';
import { formatTableDate } from '@/utils/format-dates';
import { retrieveIdToken } from '@/services/firebase/retrieve';
import { getCachedItem, removeCacheData, updateCacheData } from '@/utils/cache-helpers';

// External Imports
import { useRouter, useSearchParams } from 'next/navigation';
import { FaCamera, FaRegTrashAlt } from "react-icons/fa";
import { useEffect, useState } from 'react'
import getSymbolFromCurrency from 'currency-symbol-map'
import { doc, updateDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { set } from 'lodash';
import { ordersCol } from '@/services/firebase/constants';


const Order = () => {
    const router = useRouter()
    const params = useSearchParams()
    const { data: session } = useSession()
    const uid = session?.user.id as string;

    const cacheKey = `${orderCacheKey}-${session?.user.id}`;

    const [order, setOrder] = useState<IOrder>()
    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    // Modal state to show/hide the modal for uploading the image
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileName, setFileName] = useState("Upload Image");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (!triggerUpdate) return;

        const tid = params?.get("tid");

        if (tid) {
            setLoading(true);
            const orderData = getCachedItem(cacheKey, tid);
            if (orderData) {
                setOrder(orderData);
            }
            setLoading(false);
        }

        setTriggerUpdate(false);
    }, [triggerUpdate, cacheKey, params]);

    if (loading) {
        return (
            <div className='flex flex-col justify-center items-center h-full'>
                <LoadingSpinner />
                <span className='mt-2'>Loading Order...</span>
            </div>
        )
    }

    if (!order) {
        return (
            <div className='flex flex-col justify-center items-center h-full'>
                <div>
                    <IconButton heading="Order Not Found" animationType='hover-box' subtitle='This order may exist but failed to load.' buttonText='Back to orders' redirect='tools/inventory-and-orders' />
                </div>
            </div>
        )
    }

    async function handleDeleteOrder() {
        setDeleting(true);
        const idToken = await retrieveIdToken();
        if (!idToken) return;

        if (session?.user && order) {
            await deleteItem({ idToken, rootCol: ordersCol, subCol: order?.storeType as StoreType, item: order });
            removeCacheData(cacheKey, order.transactionId as string);
            router.push(`/u/${session.user.username}/tools/inventory-and-orders#orders`);
        }
        setDeleting(false);
    }

    const handleCameraClick = () => {
        setIsModalOpen(true);
    };

    const handleUpload = async (imageUrl?: string | null) => {
        if (!order.transactionId || !order.storeType) return;

        const docRef = doc(firestore, ordersCol, uid, order.storeType, order.transactionId);

        set(order, "image", [imageUrl]);

        // Update the database
        await updateDoc(docRef, order as { [x: string]: any; });

        // Update the users local cache
        updateCacheData(cacheKey, order);

        // Trigger an update
        setTriggerUpdate(true)
    };


    return (
        <div className='flex flex-col'>
            { /* Breadcrump & Title */}
            <section className='bg-white border-t shadow p-4 space-y-2'>
                <div className="breadcrumbs text-sm font-semibold">
                    <ul>
                        <li>
                            <a
                                className='select-none'
                                onClick={() => router.push("../inventory-and-orders#orders")}
                            >
                                Orders
                            </a>
                        </li>
                        <li>
                            <span className="inline-flex items-center gap-2">
                                {order.transactionId}
                            </span>
                        </li>
                    </ul>
                </div>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold'>{order.name}</h1>
                    <div className='text-center text-sm'>
                        <p>Storage</p>
                        <p className='text-gray-600 font-semibold'>{order.storageLocation}</p>
                    </div>
                </div>
            </section>

            {/* Order Info */}
            <section className='p-4 flex flex-col md:flex-row items-start gap-4'>
                {/* Product details */}
                <div className='md:w-2/5 flex flex-col p-6 bg-white shadow rounded-md gap-4'>
                    { /* Image */}
                    <div className='relative flex justify-center items-center'>
                        <figure className='max-w-96'>
                            <ImageModal src={order.image ? order.image[0] : ""} alt={"Order Image"} width={500} height={500} className="rounded-md" />
                            <div
                                className='absolute bottom-1 right-1 h-7 w-7 rounded-full bg-gray-500 bg-opacity-50 flex items-center justify-center cursor-pointer z-10'
                                onClick={handleCameraClick} // Open the modal when clicked
                            >
                                <FaCamera className="text-white" />
                            </div>
                        </figure>
                    </div>


                    {/* Order Info Table */}
                    <div className='w-full'>
                        <OrderInfoTable order={order} cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                    </div>
                </div>

                {/* History */}
                <div className='relative md:w-3/5 bg-white shadow rounded-md'>
                    <OrderHistory order={order} />
                    <div className="absolute top-4 right-4 z-10">
                        <div className="dropdown dropdown-bottom">
                            <label
                                tabIndex={0}
                                className="btn btn-sm px-2 rounded-md min-h-0 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                            >
                                &#x2026;
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content mt-2 right-0 menu bg-white space-y-1 rounded-lg w-40 border border-gray-200"
                            >
                                <button
                                    onClick={handleDeleteOrder}
                                    disabled={deleting}
                                    className='flex items-center gap-3 disabled:bg-muted text-red-500 font-semibold py-2 px-3 rounded-md hover:bg-gray-100 active:bg-gray-200 transition duration-200'

                                >
                                    <span><FaRegTrashAlt /></span>
                                    <span className=''>Delete</span>
                                </button>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <ImageUpload
                    title="Upload Order Image"
                    fileName={fileName}
                    url={url}
                    setIsModalOpen={setIsModalOpen}
                    setFileName={setFileName}
                    setUrl={setUrl}
                    handleUpload={handleUpload}
                />
            )}
        </div>
    )
}


interface OrderInfoTableProps {
    order: IOrder;
    cacheKey: string;
    triggerUpdate: () => void;
}

const OrderInfoTable: React.FC<OrderInfoTableProps> = ({ order, cacheKey, triggerUpdate }) => {
    const { transactionId, sale, purchase, shipping, additionalFees, customTag, storeType, listingDate, storageLocation, condition } = order;

    let soldFor: number, profit: number | "N/A", roi: number | "N/A";
    const purchasePrice = purchase?.price ?? 0;

    soldFor = sale?.price ?? 0;

    if (purchasePrice) {
        profit = soldFor - purchasePrice;
        roi = (profit / purchasePrice) * 100;
    } else {
        profit = "N/A";
        roi = "N/A";
    }

    const sellerCosts = (order.additionalFees ?? 0) + (order.shipping?.fees ?? 0);
    const currencySymbol = getSymbolFromCurrency(order.sale?.currency ?? "$")

    return (
        <table className='w-full'>
            <thead className='bg-gray-200'>
                <tr>
                    <th className='w-1/2 py-3 px-4 text-left text-gray-800 font-bold'>Product Details</th>
                    <th className='w-1/2'></th>
                </tr>
            </thead>
            <tbody className='bg-gray-100 text-left'>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Status
                    </td>
                    <td className="py-4 px-6">
                        <span className="text-gray-600">{order.status}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Marketplace
                    </td>
                    <UpdateTableField
                        type="text"
                        currentValue={storeType}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="storeType"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        tooltip="Warning! Editing this may count towards your monthly orders."
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Storage
                    </td>
                    <UpdateTableField
                        type="text"
                        currentValue={storageLocation}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="storageLocation"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Custom Tag
                    </td>
                    <UpdateTableField
                        type="text"
                        currentValue={customTag}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="customTag"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Condition
                    </td>
                    <UpdateTableField
                        type="text"
                        currentValue={condition}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="condition"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Buyer
                    </td>
                    <UpdateTableField
                        type="text"
                        currentValue={sale?.buyerUsername}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="sale.buyerUsername"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Purchase date
                    </td>
                    <UpdateTableField
                        type="date"
                        currentValue={purchase?.date ? new Date(purchase?.date).toISOString().split("T")[0] : ""}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="purchase.date"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Sale date
                    </td>
                    <UpdateTableField
                        type="date"
                        currentValue={sale?.date ? new Date(sale?.date).toISOString().split("T")[0] : ""}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="sale.date"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Listing date
                    </td>
                    <UpdateTableField
                        type="date"
                        currentValue={listingDate ? new Date(listingDate).toISOString().split("T")[0] : ""}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="listingDate"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Shipping date
                    </td>
                    <UpdateTableField
                        type="date"
                        currentValue={shipping?.date ? new Date(shipping?.date).toISOString().split("T")[0] : ""}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="shipping.date"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Quantity Sold
                    </td>
                    <UpdateTableField
                        currentValue={sale?.quantity?.toFixed(0)}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="sale.quantity"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Purchased from
                    </td>
                    <UpdateTableField
                        currentValue={purchase?.platform}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="purchase.platform"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Purchased price ({currencySymbol})
                    </td>
                    <UpdateTableField
                        currentValue={purchasePrice.toFixed(2)}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="purchase.price"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Sale price ({currencySymbol})
                    </td>
                    <UpdateTableField
                        currentValue={sale?.price?.toFixed(2)}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="sale.price"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Shipping Costs ({currencySymbol})
                    </td>
                    <UpdateTableField
                        currentValue={shipping?.fees?.toFixed(2)}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="shipping.fees"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Additional Costs ({currencySymbol})
                    </td>
                    <UpdateTableField
                        currentValue={additionalFees?.toFixed(2)}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType={order.storeType}
                        keyType="additionalFees"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Total Costs
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{currencySymbol}{(sellerCosts + (purchase?.price ?? 0)).toFixed(2)}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Order Total
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{currencySymbol}{(soldFor + (additionalFees ?? 0) + (shipping?.fees ?? 0)).toFixed(2)}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Profit
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{profit === "N/A" ? profit : `${currencySymbol}${profit.toFixed(2)}`}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        ROI
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{roi === "N/A" ? roi : roi.toFixed(2)}{roi === "N/A" ? "" : "%"}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Payout
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{currencySymbol}{soldFor.toFixed(2)}</span>
                    </td>
                </tr>
            </tbody>

        </table>
    )
}


const OrderHistory = ({ order }: { order: IOrder }) => {
    const eBayListingRoot = "https://www.ebay.com/itm/"
    return (
        <div className="p-8">
            {["Completed", "Cancelled"].includes(order.status ?? "") && (
                <div className="relative pl-8 sm:pl-32 py-6 group">
                    <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">{order.status}</div>
                    <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                        <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(new Date(order.lastModified ?? new Date()).toISOString())}</time>
                        <div className="text-xl font-bold text-slate-900 ml-2"></div>
                    </div>
                    <div className="text-slate-500 ml-2">
                        <span>Order {order.status}</span>
                    </div>
                    <div className="text-sm text-slate-400 font-[550] ml-2 mt-1">
                        {new Date(order.lastModified ?? new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>
            )}
            {order.shipping?.date && (
                <div className="relative pl-8 sm:pl-32 py-6 group">
                    <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">Shipped</div>
                    <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                        <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(order.shipping.date)}</time>
                        <div className="text-xl font-bold text-slate-900 ml-2"></div>
                    </div>
                    <div className="text-slate-500 ml-2">
                        <span>Shipped to {order.storeType} buyer. </span>
                        <span>{order.shipping.trackingNumber ? `Tracking #${order.shipping.trackingNumber}` : ""}</span>
                    </div>
                    <div className="text-sm text-slate-400 font-[550] ml-2 mt-1">
                        {new Date(order.shipping.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>
            )}
            {order.sale?.date && (
                <div className="relative pl-8 sm:pl-32 py-6 group">
                    <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">Sold</div>
                    <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                        <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(order.sale.date)}</time>
                        <div className="text-xl font-bold text-slate-900 ml-2"></div>
                    </div>
                    <div className="text-slate-500 ml-2">
                        <span>Sold on </span>
                        <span className='font-semibold'>{order.storeType} </span>
                        <span>for </span>
                        <span className='font-semibold'>{getSymbolFromCurrency(order.sale?.currency ?? "$")}{order.sale.price?.toFixed(2)}. </span>
                    </div>
                    <div className="text-sm text-slate-400 font-[550] ml-2 mt-1">
                        <span>Order Id </span>
                        <span>{order.orderId}</span>
                    </div>
                </div>
            )}
            {order.listingDate && (
                <div className="relative pl-8 sm:pl-32 py-6 group">
                    <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">{order.recordType === "manual" ? "Manually " : ""}Listed</div>
                    <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                        <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(order.listingDate)}</time>
                        <div className="text-xl font-bold text-slate-900 ml-2"></div>
                    </div>
                    <div className="text-slate-500 ml-2">
                        {order.recordType === "manual" ? (
                            <div>
                                <span>
                                    {order.storeType === "ebay" && (
                                        <>
                                            <a
                                                className='text-houseHoverBlue hover:underline'
                                                href={`${eBayListingRoot}${order.itemId}`}
                                                target='_blank'
                                            >
                                                Listing
                                            </a>{" "}
                                        </>
                                    )}
                                    {order.storeType !== "ebay" && (
                                        <>
                                            <span>Listing </span>
                                        </>
                                    )}
                                </span>
                                <span>
                                    recorded on Flippify
                                </span>
                            </div>
                        ) : (
                            <div>
                                <span>
                                    {order.storeType === "ebay" && (
                                        <>
                                            <a
                                                className='text-houseHoverBlue hover:underline'
                                                href={`${eBayListingRoot}${order.itemId}`}
                                                target='_blank'
                                            >
                                                Listed
                                            </a>{" "}
                                        </>
                                    )}
                                    {order.storeType !== "ebay" && (
                                        <>
                                            <span>Listed </span>
                                        </>
                                    )}
                                </span>
                                <span>
                                    on {order.storeType}.
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="text-sm text-slate-400 font-[550] ml-2 mt-1">
                        <span>Item Id </span>
                        <span>{order.itemId}</span>
                    </div>
                </div>
            )}
            {order.purchase?.date && (
                <div className="relative pl-8 sm:pl-32 py-6 group">
                    <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">Purchased</div>
                    <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                        <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(order.purchase.date)}</time>
                        <div className="text-xl font-bold text-slate-900 ml-2"></div>
                    </div>
                    <div className="text-slate-500 ml-2">
                        <span>Item puchased </span>
                        <span>{order.purchase.price ? `for` : ""} </span>
                        <span className='font-semibold'>{order.purchase.price ? `${getSymbolFromCurrency(order.sale?.currency ?? "$")}${order.purchase.price.toFixed(2)}` : ""} </span>
                        <span>{order.purchase.platform ? `from` : ""} </span>
                        <span className='font-semibold'>{order.purchase.platform ? `${order.purchase.platform}` : ""}</span>
                    </div>
                    <div className="text-sm text-slate-400 font-[550] ml-2 mt-1">
                        {new Date(order.purchase.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Order