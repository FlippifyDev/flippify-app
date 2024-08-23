// components/DashboardProfitsGraph.tsx
import dynamic from 'next/dynamic';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { ISale } from "./SalesTrackerModels";
import { database, ref, get } from "../../api/auth-firebase/firebaseConfig";
import { format, subDays, eachDayOfInterval, eachMonthOfInterval, endOfDay, parse } from 'date-fns';

// Dynamically import Chart component with no SSR
const Chart = dynamic(() => import('./DashboardProfitsChart'), { ssr: false });

const currencyConversionRates = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

interface ChartData {
  name: string;
  data: number[];
}

interface SalesData {
  categories: string[];
  series: ChartData[];
}

interface DashboardProfitsGraphProps {
  customerId: string;
}

const DashboardProfitsGraph: React.FC<DashboardProfitsGraphProps> = ({ customerId }) => {
  const { data: session } = useSession();
  const [salesData, setSalesData] = useState<SalesData>({
    categories: [],
    series: [],
  });
  const [netProfit, setNetProfit] = useState(0);
  const [previousNetProfit, setPreviousNetProfit] = useState(0);
  const [selectedRange, setSelectedRange] = useState('30');
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');

  const fetchSalesData = useCallback(async (rangeInDays: number) => {
    if (!customerId) return;

    try {
      const salesRef = ref(database, `sales/${customerId}`);
      const salesSnapshot = await get(salesRef);
      const salesData = salesSnapshot.val() || {};

      const today = endOfDay(new Date());
      const rangeStartDate = subDays(today, rangeInDays - 1);
      const previousRangeStartDate = subDays(rangeStartDate, rangeInDays);

      let allCategories: string[];
      if (rangeInDays > 90) {
        allCategories = eachMonthOfInterval({ start: rangeStartDate, end: today }).map(date => format(date, 'yyyy-MM'));
      } else {
        allCategories = eachDayOfInterval({ start: rangeStartDate, end: today }).map(date => format(date, 'yyyy-MM-dd'));
      }

      let seriesData = Array(allCategories.length).fill(0);

      let totalNetProfit = 0;
      let totalPreviousNetProfit = 0;

      for (const saleKey in salesData) {
        const sale: ISale = salesData[saleKey];
        const saleDate = sale.saleDate;

        if (saleDate && sale.salePrice) {
          const parsedSaleDate = parse(saleDate, 'dd/MM/yyyy', new Date());
          if (isNaN(parsedSaleDate.getTime())) {
            console.error(`Invalid date: ${saleDate}`);
            continue;
          }

          const formattedSaleDate = rangeInDays > 90 ? format(parsedSaleDate, 'yyyy-MM') : format(parsedSaleDate, 'yyyy-MM-dd');

          const purchasePricePerUnit = sale.purchasePricePerUnit || 0;
          const platformFees = sale.platformFees || 0;
          const shippingCost = sale.shippingCost || 0;
          const totalSaleRevenue = sale.quantitySold * sale.salePrice;
          const totalPurchaseCost = sale.quantitySold * purchasePricePerUnit;
          const estimatedProfit =
            totalSaleRevenue -
            totalPurchaseCost -
            totalSaleRevenue * (platformFees / 100) -
            shippingCost;

          const index = allCategories.indexOf(formattedSaleDate);
          if (index !== -1) {
            seriesData[index] += estimatedProfit;
          }

          if (parsedSaleDate >= rangeStartDate && parsedSaleDate <= today) {
            totalNetProfit += estimatedProfit;
          } else if (parsedSaleDate < rangeStartDate && parsedSaleDate >= previousRangeStartDate) {
            totalPreviousNetProfit += estimatedProfit;
          }
        }
      }

      setSalesData({
        categories: allCategories,
        series: [{ name: 'Profits', data: seriesData }],
      });
      setNetProfit(totalNetProfit);
      setPreviousNetProfit(totalPreviousNetProfit);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [customerId]);

  useEffect(() => {
    if (session && session.user && session.user.currency) {
      setCurrency(session.user.currency as 'GBP' | 'USD' | 'EUR');
    }
  }, [session]);

  useEffect(() => {
    fetchSalesData(parseInt(selectedRange));
  }, [customerId, selectedRange, fetchSalesData]);

  const percentageChange = previousNetProfit === 0 ? netProfit * 100 : ((netProfit - previousNetProfit) / Math.abs(previousNetProfit)) * 100;

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    fetchSalesData(parseInt(range));
  };

  const timePeriodText = {
    '7': 'week',
    '30': 'month',
    '90': 'past 3 months',
    '365': 'year'
  }[selectedRange] || 'period';

  return (
    <div className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white">
            {currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€'}{netProfit.toFixed(2)}
          </h5>
          <span className="inline-flex items-center text-md mt-2 font-normal text-gray-500 dark:text-gray-400">
            Net profit this {timePeriodText}
          </span>
        </div>
        <div className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'} text-center`}>
          {percentageChange >= 1000 ? `${(percentageChange / 1000).toFixed(2)}k` : percentageChange.toFixed(2)}%
          <svg className={`w-3 h-3 ms-1 ${percentageChange >= 0 ? '' : 'rotate-180'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
          </svg>
        </div>
      </div>
      {/* Chart component */}
      <Chart salesData={salesData} selectedRange={selectedRange} currency={currency} currencyConversionRates={currencyConversionRates} />

      {/* Dropdown for selecting date range */}
      <div className="dropdown dropdown-hover bg-white">
        <div tabIndex={0} role="button" className="btn m-1 text-lightModeText bg-white hover:bg-gray-100">
          Last {selectedRange} days
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow">
          {['7', '30', '90', '365'].map(range => (
            <li key={range}>
              <a onClick={() => handleRangeChange(range)}>
                Last {range} days
              </a>
            </li>
          ))}
        </ul>
      </div>

      
    </div>
  );
};

export default DashboardProfitsGraph;
