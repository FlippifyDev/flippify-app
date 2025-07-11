"use client";

import { IOrder } from '@/models/store-data';
import { IHistoryGrid } from '@/models/recent-sales';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { calculateOrderProfit } from '@/utils/calculate';

const currencySymbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
};

interface DashboardRecentSalesCardProps {
    salesData: IOrder[];
    currency: string;
}

const DashboardRecentSalesCard: React.FC<DashboardRecentSalesCardProps> = ({ salesData, currency }) => {
    const maxPreviousSales = 5; // Set the maximum number of recent sales to retrieve
    const [sales, setSales] = useState<IHistoryGrid[]>([]);
    const currencySymbol = currencySymbols[currency] || '$'; // Get the currency symbol based on the currency

    useEffect(() => {
        const salesArray: IHistoryGrid[] = salesData.map((order) => {
            const salePrice = order.sale?.price || 0;
            const purchasePrice = order.purchase?.price || 0;
            const shippingCost = order.shipping?.sellerFees || 0;
            const otherCosts = order.additionalFees || 0;

            const totalCosts = purchasePrice + otherCosts;
            const estimatedProfit = calculateOrderProfit({ item: order })

            return {
                itemName: order.name,
                purchaseDate: order.purchase?.date ? format(new Date(order.purchase?.date), 'dd MMM yyyy') : 'N/A',
                saleDate: order.sale?.date ? format(new Date(order.sale?.date), 'dd MMM yyyy') : 'N/A',
                quantitySold: order.sale?.quantity,
                purchasePricePerUnit: order.sale?.quantity ? purchasePrice / order.sale.quantity : 0,
                salePrice: salePrice,
                totalCosts: totalCosts,
                estimatedProfit: estimatedProfit,
                salePlatform: order.sale?.platform || 'N/A',
                storageLocation: order.storageLocation || 'N/A',
                shippingCost: shippingCost,
                otherCosts: otherCosts,
                status: order.status,
            };
        });

        // Sort the sales by date in descending order and take the first 5 entries
        const recentSales = salesArray
            .sort((a, b) => new Date(b.saleDate ?? "").getTime() - new Date(a.saleDate ?? "").getTime())
            .slice(0, maxPreviousSales);

        setSales(recentSales);
    }, [salesData]);

    return (
        <div className="card bg-white shadow rounded-lg p-4 h-full flex flex-col">
            <h2 className="card-title text-lightModeText text-xl font-semibold">
                Recent Sales Activity
            </h2>
            <div className="overflow-x-auto mt-4 flex-1">
                <table className="table w-full">
                    <thead>
                        <tr className="text-lightModeText">
                            <th colSpan={2}>DATE</th>
                            <th colSpan={3}>PRODUCT NAME</th>
                            <th colSpan={1}>QUANTITY SOLD</th>
                            <th colSpan={1}>COST</th>
                            <th colSpan={1}>SOLD FOR</th>
                            <th colSpan={1}>PROFIT</th>
                            <th colSpan={2}>STORAGE</th>
                            <th colSpan={1}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length > 0 ? (
                            sales.map((order, index) => (
                                <tr key={index}>
                                    <td colSpan={2}>{order.saleDate}</td>
                                    <td colSpan={3}>{order.itemName}</td>
                                    <td colSpan={1}>{order.quantitySold}</td>
                                    <td colSpan={1}>{currencySymbol}{order.totalCosts?.toFixed(2)}</td>
                                    <td colSpan={1}>{currencySymbol}{order.salePrice?.toFixed(2)}</td>
                                    <td colSpan={1}>{currencySymbol}{order.estimatedProfit?.toFixed(2)}</td>
                                    <td colSpan={2}>{order.storageLocation}</td>
                                    <td className={`${order.status === 'Completed' ? "text-houseBlue font-semibold" : ""}`} colSpan={1}>{order.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="text-center">Log sales with the Sales & Profits tool.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardRecentSalesCard;
