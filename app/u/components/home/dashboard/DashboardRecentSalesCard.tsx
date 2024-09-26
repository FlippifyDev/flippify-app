"use client";

import { IHistoryGrid, ISale } from '../../tools/sales-tracker/SalesTrackerModels';
import { auth, database, ref, get } from '@/app/api/auth-firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { parse, format } from 'date-fns';

const currencySymbols: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

interface DashboardRecentSalesCardProps {
  customerId: string;
}

const DashboardRecentSalesCard: React.FC<DashboardRecentSalesCardProps> = ({ customerId }) => {
  const maxPreviousSales = 5;
  const [user] = useAuthState(auth);
  const { data: session } = useSession();
  const [sales, setSales] = useState<IHistoryGrid[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState('£');

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
            const sale: ISale = salesData[saleKey];

            if (sale.itemName && sale.purchaseDate && sale.saleDate) {
              const salePrice = sale.salePrice || 0;
              const purchasePricePerUnit = sale.purchasePricePerUnit || 0;
              const platformFees = sale.platformFees || 0;
              const shippingCost = sale.shippingCost || 0;

              const totalSaleRevenue = sale.quantitySold * salePrice;
              const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;
              const totalPlatformFees = totalSaleRevenue * (platformFees / 100);

              const totalCosts = totalPurchaseCost + totalPlatformFees + shippingCost;
              const estimatedProfit = totalSaleRevenue - totalCosts;

              const parsedSaleDate = parse(sale.saleDate, 'dd/MM/yyyy', new Date());
              const parsedPurchaseDate = parse(sale.purchaseDate, 'dd/MM/yyyy', new Date());

              salesArray.push({
                ...sale,
                purchaseDate: format(parsedPurchaseDate, 'yyyy-MM-dd'),
                saleDate: format(parsedSaleDate, 'yyyy-MM-dd'),
                quantitySold: sale.quantitySold,
                purchasePricePerUnit: purchasePricePerUnit,
                salePrice: salePrice,
                totalCosts: totalCosts,
                estimatedProfit: estimatedProfit,
                salePlatform: sale.salePlatform,
                purchasePlatform: sale.purchasePlatform,
              });
            }
          }

          // Sort the sales by date in descending order and take the last 5 entries
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
              <th colSpan={2}>Purchase Platform</th>
              <th colSpan={1}>Sale Price</th>
              <th colSpan={1}>Quantity Sold</th>
              <th colSpan={1}>Total Costs</th>
              <th colSpan={1}>Profit</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <tr key={index}>
                  <td colSpan={2}>{sale.saleDate}</td>
                  <td colSpan={4}>{sale.itemName}</td>
                  <td colSpan={2}>{sale.purchasePlatform}</td>
                  <td colSpan={1}>{currencySymbol}{sale.salePrice.toFixed(2)}</td>
                  <td colSpan={1}>{sale.quantitySold}</td>
                  <td colSpan={1}>{currencySymbol}{sale.totalCosts.toFixed(2)}</td>
                  <td colSpan={1}>{currencySymbol}{sale.estimatedProfit.toFixed(2)}</td>
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
