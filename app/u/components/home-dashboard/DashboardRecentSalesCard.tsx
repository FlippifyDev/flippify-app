import { IHistoryGrid, ISale } from '../tool-sales-tracker/SalesTrackerModels';
import { auth, database, ref, get } from '../../../api/auth-firebase/firebaseConfig';

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

              // Parse the sale date
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

          salesArray.sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());

          setSales(salesArray);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user, customerId]);

  return (
    <div className="card bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <h2 className="card-title text-lightModeText text-xl font-semibold">
        Recent Sales Activity
      </h2>
      <div className="overflow-x-auto mt-4 flex-1">
        <table className="table w-full">
          <thead>
            <tr className="text-lightModeText">
              <th>Date</th>
              <th>Product Name</th>
              <th>Purchase Platform</th>
              <th>Sale Price</th>
              <th>Quantity Sold</th>
              <th>Total Costs</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((sale, index) => (
                <tr key={index}>
                  <td>{sale.saleDate}</td>
                  <td>{sale.itemName}</td>
                  <td>{sale.purchasePlatform}</td>
                  <td>{currencySymbol}{sale.salePrice.toFixed(2)}</td>
                  <td>{sale.quantitySold}</td>
                  <td>{currencySymbol}{sale.totalCosts.toFixed(2)}</td>
                  <td>{currencySymbol}{sale.estimatedProfit.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">Log sales with the Sales & Profits tool.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardRecentSalesCard;
