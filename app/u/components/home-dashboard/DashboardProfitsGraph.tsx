import { format, subDays, eachDayOfInterval, eachMonthOfInterval, endOfDay, parse } from 'date-fns';
import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

import { ISale } from "../tool-sales-tracker/SalesTrackerModels";
import { database, ref, get } from "../../../api/auth-firebase/firebaseConfig";

// Dynamically import Chart component with no SSR
const Chart = dynamic(() => import('./DashboardProfitsChart'), { ssr: false });

const currencySymbols: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
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
  const [currencySymbol, setCurrencySymbol] = useState('£');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

      let seriesData: number[] = Array(allCategories.length).fill(0);

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
    fetchSalesData(parseInt(selectedRange));
  }, [customerId, selectedRange, fetchSalesData]);

  const percentageChange = previousNetProfit === 0 ? netProfit * 100 : ((netProfit - previousNetProfit) / Math.abs(previousNetProfit)) * 100;

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    fetchSalesData(parseInt(range));
    setDropdownOpen(false); // Close the dropdown after selecting
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown open/close
  };

  const closeDropdown = () => {
    setDropdownOpen(false); // Close the dropdown
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
            {currencySymbol}{netProfit.toFixed(2)}
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
      <Chart salesData={salesData} selectedRange={selectedRange} currencySymbol={currencySymbol} />

      {/* Dropdown for selecting date range */}
      <div className="relative">
        <div
          className="btn m-1 text-lightModeText bg-white hover:bg-gray-100 transition duration-200 rounded-lg"
          onClick={toggleDropdown} // Toggle dropdown on click
          onMouseEnter={closeDropdown} // Ensure hover doesn't affect the click
        >
          Last {selectedRange} days
        </div>
        {dropdownOpen && (
          <ul
            className="absolute left-0 bg-white border-gray-100 z-[1] w-52 p-2 shadow transition duration-200 rounded-lg"
            style={{ marginTop: '-4px' }} // Negative margin to remove the gap
          >
            {['7', '30', '90', '365'].map(range => (
              <li key={range}>
                <a
                  onClick={() => handleRangeChange(range)}
                  className="block px-4 py-2 hover:bg-gray-200 transition duration-200 rounded-lg"
                >
                  Last {range} days
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardProfitsGraph;
