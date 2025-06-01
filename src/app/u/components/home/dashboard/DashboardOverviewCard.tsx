import { IListing, IOrder } from '@/models/store-data';
import { currencySymbols } from '@/config/currency-config';

import React, { useEffect, useState } from 'react';

import "@/styles/overview-cards.css"
import { IOneTimeExpense } from '@/models/expenses';

interface DashboardOverviewCardProps {
    salesData: IOrder[];
    inventoryData: IListing[];
    oneTimeExpensesData: IOneTimeExpense[];
    currency: string;
    selectedRange: number;
}

interface OverviewData {
    totalRevenue: number;
    totalCosts: number;
    totalSales: number;
    inventoryCost: number;
}

const DashboardOverviewCard: React.FC<DashboardOverviewCardProps> = ({ salesData, inventoryData, oneTimeExpensesData, currency, selectedRange }) => {
    const [overviewData, setOverviewData] = useState<OverviewData>({
        totalRevenue: 0,
        totalCosts: 0,
        totalSales: 0,
        inventoryCost: 0,
    });

    useEffect(() => {
        if (!salesData || salesData.length === 0) return;

        let totalRevenue = 0;
        let totalCosts = 0;
        let totalSales = 0;

        // Calculate inventory cost: sum of purchase price * quantity for all listings
        const inventoryCost = inventoryData.reduce((sum, item) => {
            const price = item.purchase?.price || 0;
            const qty = item.quantity || 0;
            return sum + price * qty;
        }, 0);

        salesData.forEach((order: IOrder) => {
            if (order.status !== 'Completed' || !order.sale?.date || !order.purchase?.price || !order.sale.quantity) return;
            const quantity = order.sale.quantity || 0;
            const salePrice = (order.sale.price || 0) * quantity;
            const purchasePrice = (order.purchase.price || 0) * quantity;
            const additionalFees = order.additionalFees || 0;

            totalRevenue += salePrice;
            totalCosts += purchasePrice + additionalFees;
            totalSales += order.sale.quantity;
        });

        oneTimeExpensesData.forEach((expense: IOneTimeExpense) => {
            totalCosts += expense.amount ?? 0;
        })

        setOverviewData({
            totalRevenue,
            totalCosts,
            totalSales,
            inventoryCost,
        });

    }, [salesData, inventoryData, selectedRange, oneTimeExpensesData]);

    const roi = overviewData.totalCosts > 0
        ? ((overviewData.totalRevenue - overviewData.totalCosts) / overviewData.totalCosts * 100).toFixed(2)
        : 'N/A';

    const currencySymbol = currencySymbols[currency] || '$';

    return (
        <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-2 lg:grid-cols-5 font-semibold justify-center gap-2 sm:gap-4 w-full">
                <div className="stats shadow bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
                    <div className="stat">
                        <div className="stat-title text-sm sm:text-base text-houseBlue">Total Revenue</div>
                        <div className="stat-value font-bold text-xl sm:text-2xl text-black">
                            {currencySymbol}{overviewData.totalRevenue.toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="stats shadow bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
                    <div className="stat">
                        <div className="stat-title text-sm sm:text-base text-houseBlue">Total Costs</div>
                        <div className="stat-value font-bold text-xl sm:text-2xl text-black">
                            {currencySymbol}{overviewData.totalCosts.toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="stats shadow bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
                    <div className="stat">
                        <div className="stat-title text-sm sm:text-base text-houseBlue">No. Sales</div>
                        <div className="stat-value font-bold text-xl sm:text-2xl text-black">
                            {overviewData.totalSales}
                        </div>
                    </div>
                </div>
                <div className="stats shadow bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
                    <div className="stat">
                        <div className="stat-title text-sm sm:text-base text-houseBlue">Inventory</div>
                        <div className="stat-value font-bold text-xl sm:text-2xl text-black">
                            {currencySymbol}{overviewData.inventoryCost.toFixed(2)}
                        </div>
                    </div>
                </div>
                <div className="col-span-2 lg:col-span-1 stats shadow bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg">
                    <div className="stat">
                        <div className="stat-title text-sm sm:text-base text-houseBlue">ROI</div>
                        <div className="stat-value font-bold text-xl sm:text-2xl text-black">{roi}%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverviewCard;
