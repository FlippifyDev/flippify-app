"use client";

import { IOrder } from '@/models/ebay-api-models';
import { IHistoryGrid } from '@/models/recent-sales-models';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

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
  const currencySymbol = currencySymbols[currency] || '£'; // Get the currency symbol based on the currency

  useEffect(() => {
    const salesArray: IHistoryGrid[] = salesData.map((sale) => {
      const salePrice = sale.salePrice || 0;
      const purchasePricePerUnit = sale.purchasePrice || 0;
      const shippingCost = sale.shippingFees || 0;
      const otherCosts = sale.otherFees || 0;

      const totalSaleRevenue = sale.quantitySold * salePrice;
      const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;

      const totalCosts = totalPurchaseCost + shippingCost + otherCosts;
      const estimatedProfit = totalSaleRevenue - totalCosts;

      return {
        itemName: sale.itemName,
        purchaseDate: sale.purchaseDate ? format(new Date(sale.purchaseDate), 'dd MMM yyyy') : 'N/A',
        saleDate: sale.saleDate ? format(new Date(sale.saleDate), 'dd MMM yyyy') : 'N/A',
        quantitySold: sale.quantitySold,
        purchasePricePerUnit: purchasePricePerUnit,
        salePrice: salePrice,
        totalCosts: totalCosts,
        estimatedProfit: estimatedProfit,
        salePlatform: sale.salePlatform || 'N/A',
        purchasePlatform: sale.purchasePlatform || 'N/A',
        shippingCost: shippingCost,
        otherCosts: otherCosts
      };
    });

    // Sort the sales by date in descending order and take the first 5 entries
    const recentSales = salesArray
      .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
      .slice(0, maxPreviousSales);

    setSales(recentSales);
  }, [salesData]);

  return (
    <div className="card bg-white shadow-sm rounded-lg p-4 h-full flex flex-col border mb-2">
      <h2 className="card-title text-lightModeText text-xl font-semibold">
        Recent Sales Activity
      </h2>
      <div className="overflow-x-auto mt-4 flex-1">
        <table className="table w-full">
          <thead>
            <tr className="text-lightModeText">
              <th colSpan={2}>Date</th>
              <th colSpan={4}>Product Name</th>
              <th colSpan={1}>Quantity Sold</th>
              <th colSpan={1}>Cost</th>
              <th colSpan={1}>Sold For</th>
              <th colSpan={1}>Profit</th>
              <th colSpan={2}>Purchase Platform</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <tr key={index}>
                  <td colSpan={2}>{sale.saleDate}</td>
                  <td colSpan={4}>{sale.itemName}</td>
                  <td colSpan={1}>{sale.quantitySold}</td>
                  <td colSpan={1}>{currencySymbol}{sale.totalCosts.toFixed(2)}</td>
                  <td colSpan={1}>{currencySymbol}{sale.salePrice.toFixed(2)}</td>
                  <td colSpan={1}>{currencySymbol}{sale.estimatedProfit.toFixed(2)}</td>
                  <td colSpan={2}>{sale.purchasePlatform}</td>
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
