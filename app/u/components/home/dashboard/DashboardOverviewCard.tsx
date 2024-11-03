import { database, ref, get } from '../../../../api/auth-firebase/firebaseConfig';
import { ISale } from '../../tools/sales-tracker/SalesTrackerModels';
import '@/styles/overview-cards.css';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MdError } from "react-icons/md";

// Currency symbols mapping
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



const DashboardOverviewCard = () => {
  const { data: session } = useSession();
  const [missingCosts, setMissingCosts] = useState(false);
  const customerId = session?.user.customerId;
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    totalSales: 0
  });
  const [currencySymbol, setCurrencySymbol] = useState('£');

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (session && session.user) {
        const userRef = ref(database, `users/${customerId}`);
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

    if (session && session.user && customerId) {
      loadUserCurrency();
    }
  }, [session]);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return;

      try {
        // Target sales data for the specific customerId
        const salesRef = ref(database, `sales/${customerId}`);
        const salesSnapshot = await get(salesRef);
        const salesData = salesSnapshot.val();

        if (!salesData) {
          return;
        }

        let totalRevenue = 0;
        let totalCosts = 0;
        let totalSales = 0;

        // Iterate over each order within the customer's sales data
        for (const orderId in salesData) {
          const sale: IOrder = salesData[orderId];

          // Ensure all necessary fields are available
          if (sale.itemName && sale.saleDate) {
            const salePrice = sale.salePrice || 0;
            const purchasePricePerUnit = sale.purchasePrice || null;
            const shippingCost = sale.shippingFees || 0;
            const otherCosts = sale.otherFees || 0;

            const totalSaleRevenue = sale.quantitySold * salePrice;

            if (purchasePricePerUnit) {
              const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;
              totalRevenue += totalSaleRevenue;
              totalCosts += totalPurchaseCost + shippingCost + otherCosts;
            } else {
              setMissingCosts(true);
            }
            
            totalSales += sale.quantitySold;
          }
        }

        setOverviewData({
          totalRevenue,
          totalCosts,
          totalSales
        });
      } catch (error) {
        console.error('Error fetching sales data from Firebase:', error);
      }
    };

    fetchData();
  }, [customerId]);

  const roi = overviewData.totalCosts > 0
    ? ((overviewData.totalRevenue - overviewData.totalCosts) / overviewData.totalCosts * 100).toFixed(2)
    : 'N/A';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 font-semibold justify-center gap-2 w-full">
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg border">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Revenue</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">
              {currencySymbol}{overviewData.totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg border">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Costs</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">
              {currencySymbol}{overviewData.totalCosts.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg border">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">No. Sales</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">
              {overviewData.totalSales}
            </div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 rounded-lg border">
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
