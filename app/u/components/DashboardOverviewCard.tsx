import React, { useState, useEffect } from 'react';
import { database, ref, get } from '../../api/auth-firebase/firebaseConfig';
import { ISale } from './SalesTrackerModels';
import '@/styles/overview-cards.css';
import { useSession } from 'next-auth/react';

const currencyConversionRates = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

interface DashboardOverviewCardProps {
  customerId: string;
}

const DashboardOverviewCard: React.FC<DashboardOverviewCardProps> = ({ customerId }) => {
  const { data: session } = useSession();
  const [overviewData, setOverviewData] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    totalSales: 0
  });
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');

  useEffect(() => {
    if (session && session.user && session.user.currency) {
      setCurrency(session.user.currency as 'GBP' | 'USD' | 'EUR');
    }
  }, [session]);

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

  const currencySymbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
  const conversionRate = currencyConversionRates[currency];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-2 lg:grid-cols-4 font-semibold justify-center gap-2 w-full">
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Revenue</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">{currencySymbol}{(overviewData.totalRevenue * conversionRate).toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Costs</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">{currencySymbol}{(overviewData.totalCosts * conversionRate).toFixed(2)}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">No. Sales</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">{overviewData.totalSales}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2">
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
