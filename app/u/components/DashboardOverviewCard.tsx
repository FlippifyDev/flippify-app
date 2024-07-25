"use client";

import React, { useState, useEffect } from 'react';
import { auth, database, ref, get } from "../../api/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { IHistoryGrid, ISale } from "./SalesTrackerModels";

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
          const salesRef = ref(database, `sales/${user.uid}`);
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
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [user]);

  return (
    <div className="w-full flex justify-between items-center gap-4 p-4">
      <h2 className="text-2xl font-bold text-black">Your Dashboard</h2>
      <div className="flex justify-center gap-4">
        <div className="stats shadow-md bg-white w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
          <div className="stat">
            <div className="stat-title text-houseBlue">Total Revenue</div>
            <div className="stat-value text-2xl text-black">£{overviewData.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
          <div className="stat">
            <div className="stat-title text-houseBlue">Total Costs</div>
            <div className="stat-value text-2xl text-black">£{overviewData.totalCosts.toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full sm:w-56 lg:w-72 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
          <div className="stat">
            <div className="stat-title text-houseBlue">No. Sales</div>
            <div className="stat-value text-2xl text-black">{overviewData.totalSales}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewCard;
