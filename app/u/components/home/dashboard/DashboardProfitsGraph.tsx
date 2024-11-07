"use client";

import { IOrder } from "@/hooks/useSalesData";
import {
  startOfDay,
  startOfWeek,
  endOfWeek,
  endOfMonth,
  format,
  subDays,
  parseISO,
  parse,
  isWithinInterval,
  addDays,
  addMonths
} from "date-fns";
import { enGB } from 'date-fns/locale';
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("./DashboardProfitsChart"), { ssr: false });

const currencySymbols: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

interface ChartData {
  categories: string[]; // Categories for x-axis
  series: { name: string; data: number[] }[]; // Data for y-axis
}

interface DashboardProfitsGraphProps {
  salesData: IOrder[];
  currency: string;
  selectedRange: number;
}

const DashboardProfitsGraph: React.FC<DashboardProfitsGraphProps> = ({
  salesData,
  currency,
  selectedRange
}) => {
  const [chartData, setChartData] = useState<ChartData>({
    categories: [],
    series: [],
  });
  const [netProfit, setNetProfit] = useState(0);
  const [previousNetProfit, setPreviousNetProfit] = useState(0);

  
  // Calculate percentage change based on previous net profit
  const percentageChange =
    previousNetProfit !== 0
      ? ((netProfit - previousNetProfit) / previousNetProfit) * 100
      : 0;


  useEffect(() => {
    const calculateProfits = () => {
      const today = startOfDay(new Date());

      let currentRangeStartDate: Date;
      let currentRangeEndDate: Date;
      let previousRangeStartDate: Date;
      let previousRangeEndDate: Date;

      // Adjust the logic for different ranges
      switch (selectedRange) {
        case 1: // Today
          currentRangeStartDate = today;
          currentRangeEndDate = today;
          previousRangeStartDate = subDays(today, 1);
          previousRangeEndDate = subDays(today, 1); // Previous day for comparison
          break;
      
        case 7: // Last Week (Monday to Sunday)
          currentRangeStartDate = startOfWeek(today, { weekStartsOn: 1 });
          currentRangeEndDate = endOfWeek(today, { weekStartsOn: 1 });
          previousRangeStartDate = subDays(currentRangeStartDate, 7); // Last week start
          previousRangeEndDate = subDays(currentRangeStartDate, 1); // Last week end
          break;
      
        case 30: // Last Month
          currentRangeStartDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of this month
          currentRangeEndDate = endOfMonth(currentRangeStartDate); // End of this month
          previousRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1); // Start of last month
          previousRangeEndDate = endOfMonth(previousRangeStartDate); // End of last month
          break;
      
        case 90: // Last 3 Months
          currentRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 2, 1); // Start of 3 months back
          currentRangeEndDate = endOfMonth(today); // Up to the end of the current month
          previousRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1); // Start of the previous 3-month period
          previousRangeEndDate = new Date(today.getFullYear(), today.getMonth() - 3, 0); // End of the previous 3-month period
          break;
      
        case 180: // Last 6 Months
          currentRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1); // Start of 6 months back
          currentRangeEndDate = endOfMonth(today); // Up to the end of the current month
          previousRangeStartDate = new Date(today.getFullYear(), today.getMonth() - 11, 1); // Start of the previous 6-month period
          previousRangeEndDate = new Date(today.getFullYear(), today.getMonth() - 6, 0); // End of the previous 6-month period
          break;
      
        case 365: // Year
          currentRangeStartDate = new Date(today.getFullYear(), 0, 1); // Start of last year
          currentRangeEndDate = endOfMonth(today); // Up to the end of the current month
          previousRangeStartDate = new Date(today.getFullYear() - 1, 0, 1); // Start of the previous year
          previousRangeEndDate = new Date(today.getFullYear(), 0, 0); // End of the previous year

          break;
      
        default:
          currentRangeStartDate = new Date(0); // Start at epoch if not defined
          currentRangeEndDate = today; // Up to today
          previousRangeStartDate = new Date(0);
          previousRangeEndDate = new Date(0);
      }

      let currentRangeNetProfit = 0;
      let previousRangeNetProfit = 0;

      // Prepare arrays for profit calculations
      const seriesData = [];
      const categories: string[] = [];

      // Create a temporary object to accumulate profits by date
      const profitByDate = new Map<string, number>();
      const profitByMonth = new Map<string, number>();

      for (const sale of salesData) {
        // Parse the sale date
        const saleDate = new Date(sale.saleDate);
      
        // Ensure sale has a profit field (if not, default to 0)
        if (!sale.purchasePrice) {
          continue
        }
        const saleProfit = ((sale.salePrice - sale.purchasePrice) * sale.quantitySold) - sale.shippingFees - sale.otherFees;

        // Check if sale falls within the current range
        if (isWithinInterval(saleDate, { start: currentRangeStartDate, end: currentRangeEndDate })) {
          // Add to current range net profit
          currentRangeNetProfit += saleProfit;

          if (selectedRange !== 365 && selectedRange !== 180) {
            // Convert the sale date to a formatted string for Map key
            const saleDateKey = format(saleDate, 'dd MM yyyy', { locale: enGB });   
            // Accumulate profit by date for daily and monthly range
            profitByDate.set(saleDateKey, (profitByDate.get(saleDateKey) || 0) + saleProfit);
          } else {
            // Convert the sale date to a formatted string for Map key
            const saleMonthKey = format(saleDate, 'MM yyyy', { locale: enGB });   
            // Accumulate profit by date for daily and monthly range
            profitByMonth.set(saleMonthKey, (profitByMonth.get(saleMonthKey) || 0) + saleProfit);         
          }
      

      
        } else if (isWithinInterval(saleDate, { start: previousRangeStartDate, end: previousRangeEndDate })) {
          // Add to previous range net profit if within previous range
          previousRangeNetProfit += saleProfit;
        }
      }

      let rangeDate = currentRangeStartDate;
      if (selectedRange === 1 || selectedRange === 7 || selectedRange === 30 || selectedRange === 90) {
        for (let i = 0; i < selectedRange; i++) {
            const rangeDateKey = format(rangeDate, 'dd MM yyyy', { locale: enGB });

            // Use the profitByDate map to get profit for each day in the range
            seriesData[i] = profitByDate.get(rangeDateKey) || 0;

            // Add formatted date to categories array for display on the graph
            categories.push(format(rangeDate, 'dd MM yyyy', { locale: enGB }));
            // Move to the next day in the range
            rangeDate = addDays(rangeDate, 1);
        }
      } else {
        const monthCount = selectedRange === 180 ? 6 : 12;

        for (let i = 0; i < monthCount; i++) {
          const rangeMonthKey = format(rangeDate, 'MM yyyy', { locale: enGB });
          
          // Check for profit by month
          seriesData[i] = profitByMonth.get(rangeMonthKey) || 0;
          
          // Add formatted date to categories array for display on the graph
          categories.push(rangeMonthKey); // Push month-year format for x-axis
          // Move to the next month in the range
          rangeDate = addMonths(rangeDate, 1);
        }
      }
        

      // Set net profits
      setNetProfit(currentRangeNetProfit);
      setPreviousNetProfit(previousRangeNetProfit);

      // Set chart data
      setChartData({
        categories,
        series: [
          {
            name: "Profit",
            data: seriesData,
          },
        ],
      });
    };

    calculateProfits();
  }, [salesData, currency, selectedRange]);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div>
          <h5 className="leading-none text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {currencySymbols[currency]}
            {netProfit.toFixed(2)}
          </h5>
          <span className="inline-flex items-center text-md mt-2 font-normal text-gray-500 dark:text-gray-400">
            Net profit this period
          </span>
        </div>
        <div
          className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${
            percentageChange >= 0 ? "text-green-500" : "text-red-500"
          } text-center`}
        >
          {percentageChange >= 1000
            ? `${(percentageChange / 1000).toFixed(2)}k`
            : percentageChange.toFixed(2)}
          %
          <svg
            className={`w-3 h-3 ms-1 ${
              percentageChange >= 0 ? "" : "rotate-180"
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13V1m0 0L1 5m4-4 4 4"
            />
          </svg>
        </div>
      </div>

      {/* Chart component */}
      <Chart
        salesData={chartData}
        selectedRange={selectedRange}
        currencySymbol={currencySymbols[currency]}
      />
    </div>
  );
};

export default DashboardProfitsGraph;
