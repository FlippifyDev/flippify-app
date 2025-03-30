import { IEbayOrder } from '@/models/store-data';
import { differenceInDays, isValid, parseISO } from 'date-fns';
import React from 'react'


const calculateOrderStats = (orders: IEbayOrder[]) => {
    let totalDaysToSell = 0, totalDaysToList = 0, soldItemsCount = 0, listedItemsCount = 0;
    const serviceCount: Record<string, number> = {};
    let completedOrdersCount = 0;

    for (const order of orders) {
        // Time to sell
        const listingDate = parseISO(order.listingDate);
        const saleDate = order.sale.date ? parseISO(order.sale.date) : null;

        if (isValid(listingDate) && saleDate && isValid(saleDate)) {
            const daysToSell = differenceInDays(saleDate, listingDate);
            if (daysToSell >= 0) {
                totalDaysToSell += daysToSell;
                soldItemsCount++;
            }
        }

        // Time to list
        const purchaseDate = order.purchase.date ? parseISO(order.purchase.date) : null;
        if (isValid(listingDate) && purchaseDate && isValid(purchaseDate)) {
            const daysToList = differenceInDays(listingDate, purchaseDate);
            if (daysToList >= 0) {
                totalDaysToList += daysToList;
                listedItemsCount++;
            }
        }

        // Count completed orders
        if (order.status === 'Completed') {
            completedOrdersCount++;
        }

        // Track shipping services
        const service = order.shipping.service || 'Unknown';
        serviceCount[service] = (serviceCount[service] || 0) + 1;
    }

    // Calculate averages
    const avgDaysToSell = soldItemsCount === 0 ? 0 : totalDaysToSell / soldItemsCount;
    const avgDaysToList = listedItemsCount === 0 ? 0 : totalDaysToList / listedItemsCount;

    // Find most used shipping service
    const mostUsedService = Object.entries(serviceCount).reduce(
        (max, curr) => (curr[1] > max[1] ? curr : max),
        ['', 0]
    )[0] || 'N/A';

    return {
        avgDaysToSell,
        avgDaysToList,
        mostUsedService,
        completedOrdersCount,
    };
};

interface ICardShippingInfo {
    orders: IEbayOrder[];
    loading: boolean;
    currencySymbol: string;
}



const CardShippingInfo: React.FC<ICardShippingInfo> = ({ orders, loading, currencySymbol }) => {
    const { avgDaysToSell, avgDaysToList, mostUsedService, completedOrdersCount } = calculateOrderStats(orders);

    return (
        <>
            <div className="col-span-12 lg:col-span-6 flex flex-row bg-white rounded-lg shadow-small p-4 gap-4">
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${avgDaysToSell < 1 ? '< 1 day' : avgDaysToSell.toFixed(0)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg days to sell</h3>
                </div>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${avgDaysToList < 1 ? '< 1 day' : avgDaysToList.toFixed(0)}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Avg days to list</h3>
                </div>

            </div>
            <div className="col-span-12 lg:col-span-6 flex flex-row bg-white rounded-lg shadow-small p-4 gap-4">
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${mostUsedService}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Most used shipping service</h3>
                </div>
                <div className="w-full text-center">
                    <h1 className="text-2xl font-semibold">
                        {loading ? '...' : `${completedOrdersCount}`}
                    </h1>
                    <h3 className="text-sm text-gray-500">Number of completed orders</h3>
                </div>
            </div>
        </>
    )
}

export default CardShippingInfo
