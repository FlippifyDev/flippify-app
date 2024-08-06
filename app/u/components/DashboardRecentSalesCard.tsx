import React, { useEffect, useState } from 'react';
import { auth, database, ref, get } from '../../api/auth-firebase/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IHistoryGrid, ISale } from './SalesTrackerModels';
import { parse, format } from 'date-fns';
import { useSession } from 'next-auth/react';

const currencyConversionRates = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

interface DashboardRecentSalesCardProps {
  customerId: string;
}

const DashboardRecentSalesCard: React.FC<DashboardRecentSalesCardProps> = ({ customerId }) => {
  const [user] = useAuthState(auth);
  const { data: session } = useSession();
  const [sales, setSales] = useState<IHistoryGrid[]>([]);
  const [currency, setCurrency] = useState<"GBP" | "USD" | "EUR">("GBP");

  useEffect(() => {
    if (session && session.user && session.user.currency) {
      setCurrency(session.user.currency as "GBP" | "USD" | "EUR");
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
              const totalCosts = totalSaleRevenue * (platformFees / 100) + shippingCost;

              const estimatedProfit = totalSaleRevenue - totalPurchaseCost - totalCosts;

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
  }, [user]);

  const currencySymbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "€";

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
                  <td>{currencySymbol}{(sale.salePrice * currencyConversionRates[currency]).toFixed(2)}</td>
                  <td>{sale.quantitySold}</td>
                  <td>{currencySymbol}{(sale.totalCosts * currencyConversionRates[currency]).toFixed(2)}</td>
                  <td>{currencySymbol}{(sale.estimatedProfit * currencyConversionRates[currency]).toFixed(2)}</td>
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
