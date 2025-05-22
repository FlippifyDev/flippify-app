"use client"

// Local Imports
import { IOrder } from '@/models/store-data';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { shortenText } from '@/utils/format';
import UpdateTableField from './UpdateTableField';
import { getCachedData } from '@/utils/cache-helpers';
import { formatTableDate } from '@/utils/format-dates';
import { currencySymbols } from '@/config/currency-config';
import { retrieveUserOrders } from '@/services/firebase/retrieve';
import { fetchUserOrdersCount } from '@/utils/extract-user-data';
import { retrieveUserStoreTypes } from '@/services/firebase/retrieve-admin';
import { defaultTimeFrom, orderCacheKey } from '@/utils/constants';

// External Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const Orders = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const cacheKey = `${orderCacheKey}-${session?.user.id}`;
    const currency = session?.user.preferences?.currency || "USD";

    const [orderData, setOrderData] = useState<IOrder[]>([]);

    // Page Config
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalOrders = fetchUserOrdersCount(session?.user)
    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    const paginatedData = orderData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            // Already fetched enough for this page
            if (!session?.user.authentication?.subscribed || orderData.length >= currentPage * itemsPerPage) return;

            setLoading(true);

            const storeTypes = await retrieveUserStoreTypes(session.user?.id as string, "orders");
            if (!storeTypes) return;

            // for each storeType, fetch their orders in parallel
            await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserOrders({
                        uid: session.user.id as string,
                        timeFrom: defaultTimeFrom,
                        storeType,
                    }).then((order) => [storeType, order] as const);
                })
            );

            const cache = getCachedData(cacheKey);
            if (cache) {
                const results = Object.values(cache) as IOrder[];

                const sortedResults = results.sort((a, b) => {
                    const dateA = new Date(a.sale?.date ?? 0).getTime();
                    const dateB = new Date(b.sale?.date ?? 0).getTime();
                    return dateB - dateA; // ascending (newest to oldest)
                });

                setOrderData(sortedResults);
            }

            setLoading(false);
            setTriggerUpdate(false);
        };

        if (session?.user.authentication?.subscribed && triggerUpdate) {
            fetchOrders();
            setTriggerUpdate(false)
        }
    }, [session?.user, currentPage, orderData, triggerUpdate, cacheKey]);

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setTriggerUpdate(true);
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    function handleRouteToOrderPage(order: IOrder) {
        router.push(`./inventory-and-orders/order-info?tid=${encodeURIComponent(order.transactionId ?? "no-id-found")}`);
    }

    return (
        <div className="w-full h-full  rounded-b-sm overflow-x-auto">
            <table className="table w-full">
                <thead>
                    <tr className="bg-tableHeaderBackground">
                        <th></th>
                        <th>PRODUCT</th>
                        <th>MARKETPLACE</th>
                        <th>SOLD</th>
                        <th>PURCHASED FOR ({currencySymbols[currency]})</th>
                        <th>SOLD FOR ({currencySymbols[currency]})</th>
                        <th>PROFIT ({currencySymbols[currency]})</th>
                        <th>ROI</th>
                        <th>STATUS</th>
                        <th>TAG</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((order, index) => {
                            const { transactionId, sale, purchase, customTag, status } = order;

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

                            return (
                                <tr
                                    key={`${order.transactionId}-${index}`}
                                    className='hover:bg-gray-50'
                                >
                                    <td
                                        onClick={() => handleRouteToOrderPage(order)}
                                        className={`min-w-20 cursor-pointer ${index + 1 === paginatedData.length ? "rounded-bl-xl" : ""}`}>
                                        <Image
                                            src={order.image ? order.image[0]: ""}
                                            width={100}
                                            height={100}
                                            alt={"image"}
                                            loading="lazy"
                                            className="rounded-full w-12 h-12"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </td>
                                    <td
                                        className='cursor-pointer'
                                        onClick={() => handleRouteToOrderPage(order)}>
                                        {shortenText(order.name ?? "N/A")}
                                    </td>
                                    <UpdateTableField currentValue={order?.storeType} docId={order.itemId} item={order} docType='orders' storeType={order.storeType} keyType="storeType" cacheKey={cacheKey} tooltip='Warning! Editing this may count towards your monthly orders.' triggerUpdate={() => setTriggerUpdate(true)} className='max-w-32 hover:bg-gray-100 transition duration-300' />
                                    <td className="w-32">{formatTableDate(order.sale?.date)}</td>
                                    <UpdateTableField currentValue={purchasePrice.toFixed(2)} docId={transactionId} item={order} docType='orders' storeType={order.storeType} keyType="purchase.price" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='max-w-32 hover:bg-gray-100 transition duration-300' />
                                    <td>
                                        {soldFor.toFixed(2)}
                                    </td>
                                    <td>
                                        {profit === "N/A" ? profit : profit.toFixed(2)}
                                    </td>
                                    <td>
                                        {roi === "N/A" ? roi : roi.toFixed(2)}{roi === "N/A" ? "" : "%"}
                                    </td>
                                    <td className={`${status === "Completed" ? "text-houseBlue" : ""} font-semibold`}>
                                        {status}
                                    </td>
                                    <UpdateTableField tdClassName={index + 1 === paginatedData.length ? "rounded-br-xl" : ""} currentValue={customTag} docId={transactionId} item={order} docType='orders' storeType={order.storeType} keyType="customTag" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='hover:bg-gray-100 transition duration-300' />
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? <LoadingSpinner /> : "No orders available."}
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
                                <span>{(currentPage - 1) * itemsPerPage + 1}</span>
                                <span>-</span>
                                <span>{Math.min(currentPage * itemsPerPage, orderData.length)}</span>
                                <span>of</span>
                                <span>{totalOrders}</span>
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
        </div>
    )
}

export default Orders
