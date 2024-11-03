"use client";

import { IHistoryGrid, ISale } from '../../tools/sales-tracker/SalesTrackerModels';
import { auth, database, ref, get } from '@/app/api/auth-firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';

const currencySymbols: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

interface IOrder {
  buyerUsername: string;
  expectedPayoutDate: string | null | undefined;
  itemName: string;
  legacyItemId: string;
  orderId: string;
  otherFees: number;
  purchaseDate: string | null;
  purchasePlatform: string | null;
  purchasePrice: number | null;
  quantitySold: number;
  saleDate: string;
  salePlatform: string;
  salePrice: number;
  shippingFees: number;
}

const DashboardRecentSalesCard = () => {
  const maxPreviousSales = 5; // Set the maximum number of recent sales to retrieve
  const [user] = useAuthState(auth);
  const { data: session } = useSession();
  const [sales, setSales] = useState<IHistoryGrid[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState('£');
  const customerId = session?.user.customerId;

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (session && session.user) {
        const userRef = ref(database, `users/${session.user.customerId}`);
        try {
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const userCurrency = userData?.currency || 'GBP';
          setCurrencySymbol(currencySymbols[userCurrency] || '£');
        } catch (error) {
          console.error('Error loading user currency from Firebase:', error);
        }
      }
    };

    if (session && session.user && session.user.customerId) {
      loadUserCurrency();
    }
  }, [session]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const salesRef = ref(database, `sales/${customerId}`);
          const salesSnapshot = await get(salesRef);
          const salesData = salesSnapshot.val() || {};

          const salesArray: IHistoryGrid[] = [];

          for (const saleKey in salesData) {
            const sale: IOrder = salesData[saleKey];

            if (sale.itemName && sale.purchaseDate && sale.saleDate) {
              const salePrice = sale.salePrice || 0;
              const purchasePricePerUnit = sale.purchasePrice || 0;
              const shippingCost = sale.shippingFees || 0;
              const otherCosts = sale.otherFees || 0;

              const totalSaleRevenue = sale.quantitySold * salePrice;
              const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;

              const totalCosts = totalPurchaseCost + shippingCost + otherCosts;
              const estimatedProfit = totalSaleRevenue - totalCosts;

              // Directly use the ISO date strings
              const parsedSaleDate = new Date(sale.saleDate);
              const parsedPurchaseDate = new Date(sale.purchaseDate);

              // Check if the dates are valid
              if (isNaN(parsedSaleDate.getTime())) {
                console.error(`Invalid sale date for ${sale.itemName}: ${sale.saleDate}`);
                continue; // Skip this iteration if the date is invalid
              }

              if (isNaN(parsedPurchaseDate.getTime())) {
                console.error(`Invalid purchase date for ${sale.itemName}: ${sale.purchaseDate}`);
                continue; // Skip this iteration if the date is invalid
              }

              // Push to salesArray with all required properties for IHistoryGrid
              salesArray.push({
                itemName: sale.itemName,
                purchaseDate: format(parsedPurchaseDate, 'yyyy-MM-dd'), // Format to 'yyyy-MM-dd'
                saleDate: format(parsedSaleDate, 'yyyy-MM-dd'), // Format to 'yyyy-MM-dd'
                quantitySold: sale.quantitySold,
                purchasePricePerUnit: purchasePricePerUnit,
                salePrice: salePrice,
                totalCosts: totalCosts,
                estimatedProfit: estimatedProfit,
                salePlatform: sale.salePlatform || 'N/A',
                purchasePlatform: sale.purchasePlatform || 'N/A', 
                shippingCost: shippingCost,
                otherCosts: otherCosts
              });
            }
          }

          // Sort the sales by date in descending order and take the first 5 entries
          const recentSales = salesArray
            .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
            .slice(0, maxPreviousSales);

          setSales(recentSales);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user, customerId]);

  return (
    <div className="card bg-white shadow-sm rounded-lg p-4 h-full flex flex-col border">
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
