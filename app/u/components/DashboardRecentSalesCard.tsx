import React, { useState, useEffect } from 'react';
import { auth, database, ref, get } from '../../api/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { IHistoryGrid, ISale } from './SalesTrackerModels';

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, '_');
};

const DashboardRecentSalesCard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [sales, setSales] = useState<IHistoryGrid[]>([]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const sanitizedUserId = sanitizePath(user.uid);
          const salesRef = ref(database, `sales/${sanitizedUserId}`);
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

              salesArray.push({
                ...sale,
                purchaseDate: sale.purchaseDate,
                saleDate: sale.saleDate,
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
                  <td>£{sale.salePrice.toFixed(2)}</td>
                  <td>{sale.quantitySold}</td>
                  <td>£{sale.totalCosts.toFixed(2)}</td>
                  <td>£{sale.estimatedProfit.toFixed(2)}</td>
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
