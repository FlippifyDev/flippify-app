"use client"

// Local Imports
import { IEbayOrder } from '@/models/store-data';
import UpdateTableField from './UpdateTableField';
import { getCachedItem } from '@/utils/cache-helpers';
import { formatTableDate } from '@/utils/format-dates';
import { ebayOrderCacheKey } from '@/utils/constants';

// External Imports
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react'
import getSymbolFromCurrency from 'currency-symbol-map'
import { FaRegTrashAlt } from "react-icons/fa";
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const Order = () => {
    const router = useRouter()
    const params = useSearchParams()
    const { data: session } = useSession()

    const cacheKey = `${ebayOrderCacheKey}-${session?.user.id}`;

    const [order, setOrder] = useState<IEbayOrder>()
    const [triggerUpdate, setTriggerUpdate] = useState(true);

    useEffect(() => {
        if (!triggerUpdate) return;

        const tid = params?.get("tid");

        if (tid) {
            const orderData = getCachedItem(cacheKey, tid);
            if (orderData) {
                setOrder(orderData);
            }
        }

        setTriggerUpdate(false);
    }, [triggerUpdate]);

    if (!order) {
        return (
            <div>
                <span>Could not find order</span>
            </div>
        )
    }



    return (
        <div className='flex flex-col'>
            { /* Breadcrump & Title */}
            <section className='bg-white border-t p-4 space-y-2'>
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
                <h1 className='text-2xl font-semibold'>{order.name}</h1>
            </section>

            {/* Order Info */}
            <section className='p-4 flex flex-col md:flex-row items-start gap-4'>
                {/* Product details */}
                <div className='md:w-1/2 flex flex-col p-6 bg-white rounded-md gap-4'>
                    { /* Image */}
                    <div className='flex justify-center items-center'>
                        <figure className='max-w-96'>
                            <Image
                                src={order.image[0]}
                                alt="Order Image"
                                width={500}
                                height={500}
                                className='rounded-md'
                            />
                        </figure>
                    </div>


                    {/* Order Info Table */}
                    <div className='w-full'>
                        <OrderInfoTable order={order} cacheKey={cacheKey} triggerUpdate={() => setTriggerUpdate(true)} />
                    </div>
                </div>

                {/* History */}
                <div className='relative md:w-1/2 bg-white rounded-md'>
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
                                className="dropdown-content mt-2 right-0 menu bg-white rounded-lg w-40 border border-gray-200"
                            >
                                <button
                                    className='flex items-center gap-3 text-red-500 font-semibold py-2 px-3 rounded-md hover:bg-gray-100 active:bg-gray-200 transition duration-200'
                                    
                                    >
                                    <span><FaRegTrashAlt /></span>
                                    <span className=''>Delete</span>
                                </button>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}


interface OrderInfoTableProps {
    order: IEbayOrder;
    cacheKey: string;
    triggerUpdate: () => void;
}

const OrderInfoTable: React.FC<OrderInfoTableProps> = ({ order, cacheKey, triggerUpdate }) => {
    const { transactionId, sale, purchase, shipping, additionalFees, customTag } = order;

    let soldFor: number, profit: number | "N/A", roi: number | "N/A";
    purchase.price = purchase.price ?? 0;

    soldFor = sale.price;

    if (purchase.price) {
        profit = soldFor - purchase.price;
        roi = (profit / purchase.price) * 100;
    } else {
        profit = "N/A";
        roi = "N/A";
    }

    const sellerCosts = order.additionalFees + order.shipping.fees;

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
                        Purchase date
                    </td>
                    <UpdateTableField
                        type="date"
                        currentValue={new Date(purchase.date).toISOString().split("T")[0]} 
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType='ebay'
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
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{formatTableDate(order.sale.date)}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Quantity Sold
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{order.sale.quantity}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Purchased from
                    </td>
                    <UpdateTableField
                        currentValue={purchase.platform}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType='ebay'
                        keyType="purchase.platform"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Purchased price
                    </td>
                    <UpdateTableField
                        currentValue={purchase.price.toFixed(2)}
                        docId={transactionId}
                        item={order}
                        docType='orders'
                        storeType='ebay'
                        keyType="purchase.price"
                        cacheKey={cacheKey}
                        triggerUpdate={triggerUpdate}
                        tdClassName='px-3'
                        className='max-w-64 bg-gray-100 hover:bg-gray-200 text-gray-600 !text-base transition duration-300'
                    />
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Shipping Costs
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{getSymbolFromCurrency(order.sale.currency)}{shipping.fees}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Additional Costs
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{getSymbolFromCurrency(order.sale.currency)}{additionalFees}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Total Costs
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{getSymbolFromCurrency(order.sale.currency)}{(sellerCosts + purchase.price).toFixed(2)}</span>
                    </td>
                </tr>
                <tr className='border-b'>
                    <td className="py-4 px-6 font-medium text-gray-800">
                        Profit
                    </td>
                    <td className="py-4 px-6 ">
                        <span className="text-gray-600">{getSymbolFromCurrency(order.sale.currency)}{profit === "N/A" ? profit : profit.toFixed(2)}</span>
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
                        <span className="text-gray-600">{getSymbolFromCurrency(order.sale.currency)}{(soldFor - shipping.fees - additionalFees).toFixed(2)}</span>
                    </td>
                </tr>
            </tbody>

        </table>
    )
}



const OrderHistory = ({ order }: { order: IEbayOrder }) => {
    const eBayListingRoot = "https://www.ebay.co.uk/itm/"
    console.log(order.history[0].timestamp)

    return (
        <div className="p-8">
            <div className="">
                {order.history.map((event, index) => (
                    <div key={index} className="relative pl-8 sm:pl-32 py-6 group">
                        <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">{event.title}</div>
                        <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(event.timestamp)}</time>
                            <div className="text-xl font-bold text-slate-900 ml-2"></div>
                        </div>
                        <div className="text-slate-500 ml-2">{event.description}</div>
                    </div>
                ))}
                {order.listingDate && (
                    <div className="relative pl-8 sm:pl-32 py-6 group">
                        <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">Listed</div>
                        <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(order.listingDate)}</time>
                            <div className="text-xl font-bold text-slate-900 ml-2"></div>
                        </div>
                        <div className="text-slate-500 ml-2">
                            <span>
                                <a
                                    className='text-houseHoverBlue hover:underline'
                                    href={`${eBayListingRoot}${order.itemId}`}
                                >
                                    Listed
                                </a>{" "}
                            </span>
                            <span>
                                on eBay. Item ID
                            </span>{" "}
                            <span>
                                <a
                                    className='text-houseHoverBlue hover:underline'
                                    href={`${eBayListingRoot}${order.itemId}`}
                                >
                                    {order.itemId}
                                </a>
                            </span>
                        </div>
                    </div>
                )}
                {order.purchase.date && (
                    <div className="relative pl-8 sm:pl-32 py-6 group">
                        <div className="font-caveat font-medium text-2xl text-houseHoverBlue mb-1 sm:mb-0 ml-2">Purchased</div>
                        <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-slate-300 sm:before:ml-[7rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-2 after:h-2 after:bg-houseHoverBlue after:border-4 after:box-content after:border-slate-50 after:rounded-full sm:after:ml-[7rem] after:-translate-x-1/2 after:translate-y-1.5">
                            <time className="sm:absolute left-0 translate-y-0.5 inline-flex items-center justify-center text-xs font-semibold w-24 h-6 mb-3 sm:mb-0 text-emerald-600 bg-emerald-100 rounded-full">{formatTableDate(order.purchase.date)}</time>
                            <div className="text-xl font-bold text-slate-900 ml-2"></div>
                        </div>
                        <div className="text-slate-500 ml-2">
                            <span>Item puchased </span>
                            <span>{order.purchase.price ? `for` : ""} </span>
                            <span className='font-semibold'>{order.purchase.price ? `${getSymbolFromCurrency(order.sale.currency)}${order.purchase.price}` : ""} </span>
                            <span>{order.purchase.platform ? `from` : ""} </span>
                            <span className='font-semibold'>{order.purchase.platform ? `${order.purchase.platform}` : ""}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Order