"use client"

// Local Imports
import { IOrder, StoreType } from '@/models/store-data';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { shortenText } from '@/utils/format';
import { retrieveOrders } from '@/services/bridges/retrieve';
import { formatTableDate } from '@/utils/format-dates';
import { currencySymbols } from '@/config/currency-config';
import { fetchUserOrdersCount } from '@/utils/extract-user-data';
import { defaultTimeFrom, orderCacheKey } from '@/utils/constants';
import UpdateTableField, { orderFilters } from './UpdateTableField';

// External Imports
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import NoResultsFound from '../../dom/ui/NoResultsFound';
import { ordersCol } from '@/services/firebase/constants';
import { retrieveIdToken } from '@/services/firebase/retrieve';
import { deleteItem } from '@/services/firebase/delete';
import { removeCacheData } from '@/utils/cache-helpers';
import EditExtra from '../navbar-tools/EditExtra';


interface OrdersProps {
    filter: (typeof orderFilters)[number];
    searchText?: string;
}

const Orders: React.FC<OrdersProps> = ({ filter, searchText }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const uid = session?.user.id as string;
    const cacheKey = `${orderCacheKey}-${session?.user.id}`;
    const currency = session?.user.preferences?.currency || "USD";

    const [orderData, setOrderData] = useState<IOrder[]>([]);
    const [filteredOrderData, setFilteredOrderData] = useState<IOrder[]>([]);

    // Page Config
    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const totalOrders = fetchUserOrdersCount(session?.user);
    const totalPages = Math.ceil(totalOrders / itemsPerPage);

    const paginatedData = filteredOrderData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const [nextPage, setNextPage] = useState(false);

    const [triggerUpdate, setTriggerUpdate] = useState(true);
    const [loading, setLoading] = useState(false);
    const [slowLoading, setSlowLoading] = useState(false);

    const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; item: any } | null>(null);
    const [editExtraModalOpen, setEditExtraModalOpen] = useState(false);
    const [fillItem, setFillItem] = useState<IOrder>();

    useEffect(() => {
        let filtered = orderData;
        if (filter === "Missing data") {
            filtered = orderData.filter((order) => !order.purchase?.date || !order.purchase.price);
        } else if (filter === "Active") {
            filtered = orderData.filter((order) => order.status === "Active");
        }
        setFilteredOrderData(filtered);
    }, [filter, orderData]);

    useEffect(() => {
        setTriggerUpdate(true);
    }, [searchText]);

    useEffect(() => {
        const handleClick = () => {
            handleCloseContextMenu();
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!triggerUpdate && !searchText && (!session?.user.authentication?.subscribed || filteredOrderData.length >= currentPage * itemsPerPage)) return;
            setLoading(true);

            const items = await retrieveOrders({ uid, timeFrom: defaultTimeFrom, searchText, searchFields: ["customTag", "itemId", "storeType", "name", "orderId", "status", "transactionId", "storageLocation", "sku"], pagenate: true, nextPage });
            setOrderData(items ?? []);

            setLoading(false);
            setTriggerUpdate(false);
            setNextPage(false);
        };

        if ((session?.user.authentication?.subscribed && triggerUpdate) || nextPage) {
            fetchOrders();
        }
    }, [session?.user, currentPage, filteredOrderData, triggerUpdate, filter, uid, nextPage,searchText]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            // As soon as “loading” becomes true, start a 10s timer
            timer = setTimeout(() => {
                setSlowLoading(true);
            }, 10_000);
        } else {
            // If loading is false (i.e. data arrived / spinner is removed), clear and reset
            setSlowLoading(false);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [loading]);


    // Handle page change
    const handlePageChange = (newPage: number) => {
        setTriggerUpdate(true);
        if (newPage > currentPage) {
            setNextPage(true);
        }
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    function handleRouteToOrderPage(order: IOrder) {
        router.push(`./inventory-and-orders/order-info?tid=${encodeURIComponent(order.transactionId ?? "no-id-found")}`);
    }

    const handleContextMenu = (event: React.MouseEvent, item: IOrder) => {
        let x = 50;
        let y = 50;
        // Suppress the browser’s own menu on right‐click
        if (event.type === "contextmenu") {
            event.preventDefault();
        } else {
            // Stop this click from reaching the window 'click' listener
            event.stopPropagation()

            x = - 20
        }

        setContextMenu({
            mouseX: event.clientX - x,
            mouseY: event.clientY - y,
            item,
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    function handleDisplayEditExtraModal(item: IOrder) {
        setFillItem(item);
        setEditExtraModalOpen(true);
    }

    async function handleDeleteItem(item: IOrder, storeType: StoreType) {
        const idToken = await retrieveIdToken();
        if (!idToken) return;

        setOrderData((prev) => prev.filter((order) => order.transactionId !== item.transactionId));
        await deleteItem({ idToken, rootCol: ordersCol, subCol: storeType, item })

        removeCacheData(cacheKey, item.transactionId as string);
        setTriggerUpdate(true);
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
                        <th>STORAGE</th>
                        <th>STATUS</th>
                        <th>SKU</th>
                        <th>TAG</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((order, index) => {
                            const { transactionId, sale, purchase, customTag, status, storageLocation, sku, shipping } = order;

                            let soldFor: number, profit: number | "N/A", roi: number | "N/A";
                            const purchasePrice = purchase?.price ?? 0;
                            const quantity = sale?.quantity ?? 0;
                            const sellerCosts = (order.additionalFees ?? 0) + (shipping?.sellerFees ?? 0);


                            soldFor = sale?.price ?? 0;

                            if (purchasePrice) {
                                profit = ((soldFor - purchasePrice) * quantity) - sellerCosts;
                                roi = (profit / purchasePrice) * 100;
                            } else {
                                profit = "N/A";
                                roi = "N/A";
                            }

                            return (
                                <tr
                                    key={`${order.transactionId}-${index}`}
                                    onContextMenu={(e) => handleContextMenu(e, order)}
                                    className='hover:bg-gray-50'
                                >
                                    <td
                                        onClick={() => handleRouteToOrderPage(order)}
                                        className={`min-w-20 cursor-pointer ${index + 1 === paginatedData.length ? "rounded-bl-xl" : ""}`}>
                                        <Image
                                            src={order.image ? order.image[0] : ""}
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
                                    <UpdateTableField currentValue={order?.storeType} docId={transactionId} item={order} docType={ordersCol} storeType={order.storeType} keyType="storeType" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='max-w-32 hover:bg-gray-100 transition duration-300' />
                                    <td className="min-w-32">{formatTableDate(order.sale?.date)}</td>
                                    <UpdateTableField currentValue={purchasePrice.toFixed(2)} docId={transactionId} item={order} docType={ordersCol} storeType={order.storeType} keyType="purchase.price" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='max-w-32 hover:bg-gray-100 transition duration-300' />
                                    <UpdateTableField currentValue={soldFor.toFixed(2)} docId={transactionId} item={order} docType={ordersCol} storeType={order.storeType} keyType="sale.price" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='max-w-32 hover:bg-gray-100 transition duration-300' />
                                    <td>
                                        {profit === "N/A" ? profit : profit.toFixed(2)}
                                    </td>
                                    <UpdateTableField currentValue={storageLocation} docId={transactionId} item={order} docType={ordersCol} storeType={order.storeType} keyType="storageLocation" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='hover:bg-gray-100 transition duration-300' />
                                    <td className={`${status === "Completed" ? "text-houseBlue" : ""} font-semibold`}>
                                        {status}
                                    </td>
                                    <UpdateTableField currentValue={sku} docId={transactionId} item={order} docType={ordersCol} storeType={order.storeType} keyType="sku" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='hover:bg-gray-100 transition duration-300' />
                                    <UpdateTableField tdClassName={index + 1 === paginatedData.length ? "rounded-br-xl" : ""} currentValue={customTag} docId={transactionId} item={order} docType={ordersCol} storeType={order.storeType} keyType="customTag" cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} className='hover:bg-gray-100 transition duration-300' />
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="w-full flex justify-center items-center">
                                    {loading ? (
                                        <div className="flex flex-col justify-center items-center">
                                            <LoadingSpinner />
                                            {slowLoading && (
                                                <p className="mt-2 text-sm text-gray-500 text-center">
                                                    This is taking longer than normal. If you have just
                                                    connected an account, please allow some time for us to
                                                    collect your store data.
                                                </p>
                                            )}
                                        </div>) : <div className="py-6"><NoResultsFound /></div>}
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

            {contextMenu && (
                <ul
                    className="menu menu-sm absolute z-50 bg-black text-white rounded-lg shadow-md text-sm w-48"
                    style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                >
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-muted/10 cursor-pointer"
                        onClick={() => {
                            handleDisplayEditExtraModal(contextMenu.item);
                            handleCloseContextMenu();
                        }}
                    >
                        View Extra
                    </li>
                    <li
                        className="px-2 py-1 rounded-sm hover:bg-muted/10 text-white cursor-pointer"
                        onClick={() => {
                            handleDeleteItem(contextMenu.item, contextMenu.item.storeType);
                            handleCloseContextMenu();
                        }}
                    >
                        Delete Item
                    </li>
                </ul>
            )}

            {(editExtraModalOpen && fillItem) && (
                <EditExtra fillItem={fillItem} setDisplayModal={setEditExtraModalOpen} setTriggerUpdate={setTriggerUpdate} />
            )}
        </div>
    )
}

export default Orders
