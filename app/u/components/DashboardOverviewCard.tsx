import { database, ref, get } from '../../api/auth-firebase/firebaseConfig';
import { ISale } from './SalesTrackerModels';
import React, { useState, useEffect } from 'react';


interface DashboardOverviewCardProps {
  customerId: string;
}

const DashboardOverviewCard: React.FC<DashboardOverviewCardProps> = ({ customerId }) => {
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    totalSales: 0
  });

  useEffect(() => {
    if (customerId) {
      const fetchData = async () => {
        try {
          const salesRef = ref(database, `sales/${customerId}`);
          const salesSnapshot = await get(salesRef);
          const salesData = salesSnapshot.val() || {};

          let totalRevenue = 0;
          let totalCosts = 0;
          let totalSales = 0;

          for (const saleKey in salesData) {
            const sale: ISale = salesData[saleKey];
            if (sale.itemName && sale.purchaseDate && sale.saleDate) {
              const salePrice = sale.salePrice || 0;
              const purchasePricePerUnit = sale.purchasePricePerUnit || 0;
              const platformFees = sale.platformFees || 0;
              const shippingCost = sale.shippingCost || 0;

              const totalSaleRevenue = sale.quantitySold * salePrice;
              const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;

              totalRevenue += totalSaleRevenue;
              totalCosts += totalPurchaseCost + shippingCost + (totalSaleRevenue * (platformFees / 100));
              totalSales += sale.quantitySold;
            }
          }

          setOverviewData({
            totalRevenue,
            totalCosts,
            totalSales
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [customerId]);

  const roi = overviewData.totalCosts > 0
    ? ((overviewData.totalRevenue - overviewData.totalCosts) / overviewData.totalCosts * 100).toFixed(2)
    : 'N/A';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 font-semibold justify-center gap-2 w-full">
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Revenue</div>
            <div className="stat-value text-xl sm:text-2xl text-black">£{overviewData.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Costs</div>
            <div className="stat-value text-xl sm:text-2xl text-black">£{overviewData.totalCosts.toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">No. Sales</div>
            <div className="stat-value text-xl sm:text-2xl text-black">{overviewData.totalSales}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">ROI</div>
            <div className="stat-value text-xl sm:text-2xl text-black">{roi}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCard;




/*
import { auth, database, ref, get } from '../../api/firebaseConfig';
import { ISale } from './SalesTrackerModels';

import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState, useEffect } from 'react';

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, '_');
};

const DashboardOverviewCard: React.FC = () => {
  const [user] = useAuthState(auth);
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    totalSales: 0
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const sanitizedUserId = sanitizePath(user.uid);
          const salesRef = ref(database, `sales/${sanitizedUserId}`);
          const salesSnapshot = await get(salesRef);
          const salesData = salesSnapshot.val() || {};

          let totalRevenue = 0;
          let totalCosts = 0;
          let totalSales = 0;

          for (const saleKey in salesData) {
            const sale: ISale = salesData[saleKey];
            if (sale.itemName && sale.purchaseDate && sale.saleDate) {
              const salePrice = sale.salePrice || 0;
              const purchasePricePerUnit = sale.purchasePricePerUnit || 0;
              const platformFees = sale.platformFees || 0;
              const shippingCost = sale.shippingCost || 0;

              const totalSaleRevenue = sale.quantitySold * salePrice;
              const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;

              totalRevenue += totalSaleRevenue;
              totalCosts += totalPurchaseCost + shippingCost + (totalSaleRevenue * (platformFees / 100));
              totalSales += sale.quantitySold;
            }
          }

          setOverviewData({
            totalRevenue,
            totalCosts,
            totalSales
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [user]);

  const roi = overviewData.totalCosts > 0
    ? ((overviewData.totalRevenue - overviewData.totalCosts) / overviewData.totalCosts * 100).toFixed(2)
    : 'N/A';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 font-semibold justify-center gap-2 w-full">
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Revenue</div>
            <div className="stat-value text-xl sm:text-2xl text-black">£{overviewData.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Costs</div>
            <div className="stat-value text-xl sm:text-2xl text-black">£{overviewData.totalCosts.toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">No. Sales</div>
            <div className="stat-value text-xl sm:text-2xl text-black">{overviewData.totalSales}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">ROI</div>
            <div className="stat-value text-xl sm:text-2xl text-black">{roi}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCard;

*/