"use client";

import React, { useEffect, useState, useCallback } from 'react';
import ApexCharts from 'apexcharts';
import { auth, database, ref, get } from "../../api/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { ISale } from "./SalesTrackerModels";
import { format, subDays, eachDayOfInterval, eachMonthOfInterval, startOfToday } from 'date-fns';

interface ChartData {
  name: string;
  data: number[];
}

interface SalesData {
  categories: string[];
  series: ChartData[];
}

interface TooltipFormatterOpts {
  dataPointIndex: number;
}

const DashboardProfitsGraph: React.FC = () => {
  const [user] = useAuthState(auth);
  const [salesData, setSalesData] = useState<SalesData>({
    categories: [],
    series: []
  });
  const [netProfit, setNetProfit] = useState(0);
  const [previousNetProfit, setPreviousNetProfit] = useState(0);
  const [selectedRange, setSelectedRange] = useState('30');

  const fetchSalesData = useCallback(async (rangeInDays: number) => {
    if (!user) return;

    try {
      const salesRef = ref(database, `sales/${user.uid}`);
      const salesSnapshot = await get(salesRef);
      const salesData = salesSnapshot.val() || {};

      const today = startOfToday();
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
          const formattedSaleDate = rangeInDays > 90 ? format(new Date(saleDate), 'yyyy-MM') : format(new Date(saleDate), 'yyyy-MM-dd');

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

          const saleDateObj = new Date(saleDate);
          if (saleDateObj >= rangeStartDate && saleDateObj <= today) {
            totalNetProfit += estimatedProfit;
          } else if (saleDateObj < rangeStartDate && saleDateObj >= previousRangeStartDate) {
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
      console.error("Error fetching data:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchSalesData(parseInt(selectedRange));
  }, [user, selectedRange, fetchSalesData]);

  useEffect(() => {
    const options = {
      chart: {
        type: 'area',
        height: 300,
        toolbar: {
          show: false
        }
      },
      series: salesData.series,
      xaxis: {
        categories: salesData.categories,
        labels: {
          show: true,
          formatter: (val: string, index: number) => {
            console.log('Date value:', val);  // Debugging log
            const date = new Date(val);
            if (isNaN(date.getTime())) {
              console.error('Invalid date:', val);
              return '';
            }
            if (selectedRange === '30') {
              return format(date, 'd');
            } else if (selectedRange === '90') {
              return '';
            } else if (selectedRange === '365') {
              return format(date, 'MMM');
            }
            return format(date, 'd MMM');
          },
          cssClass: 'text-xs text-gray-500'
        },
        tooltip: {
          enabled: selectedRange === '90',
          formatter: (val: string, opts: TooltipFormatterOpts) => {
            const date = new Date(salesData.categories[opts.dataPointIndex]);
            console.log('Tooltip date value:', date);  // Debugging log
            if (isNaN(date.getTime())) {
              console.error('Invalid tooltip date:', salesData.categories[opts.dataPointIndex]);
              return '';
            }
            return format(date, 'MMM');
          }
        }
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (val: number) => `£${val}`,
          cssClass: 'text-xs text-gray-500'
        }
      },
      stroke: {
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
          formatter: (val: string, opts: TooltipFormatterOpts) => {
            const date = new Date(salesData.categories[opts.dataPointIndex]);
            if (isNaN(date.getTime())) {
              console.error('Invalid tooltip date:', salesData.categories[opts.dataPointIndex]);
              return '';
            }
            return format(date, 'd MMMM yyyy');
          }
        },
        y: {
          formatter: (val: number) => `£${val.toFixed(2)}`,
        },
      },
    };

    const chart = new ApexCharts(document.querySelector("#area-chart"), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [salesData, selectedRange]);

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
          <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
            £{netProfit.toFixed(2)}
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">Profits this {timePeriodText}</p>
        </div>
        <div className={`flex items-center px-2.5 py-0.5 text-base font-semibold ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'} text-center`}>
          {percentageChange >= 1000 ? `${(percentageChange / 1000).toFixed(2)}k` : percentageChange.toFixed(2)}%
          <svg className={`w-3 h-3 ms-1 ${percentageChange >= 0 ? '' : 'rotate-180'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13V1m0 0L1 5m4-4 4 4"/>
          </svg>
        </div>
      </div>
      <div id="area-chart"></div>
      <div className="grid grid-cols-1 items-center border-gray-200 border-t  dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-5">
          <div className="dropdown dropdown-hover bg-white">
            <div tabIndex={0} role="button" className="btn m-1 text-lightModeText bg-white hover:bg-gray-100">Last {selectedRange} days</div>
            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow text-lightModeText">
              <li><a onClick={() => handleRangeChange('7')}>Last 7 days</a></li>
              <li><a onClick={() => handleRangeChange('30')}>Last 30 days</a></li>
              <li><a onClick={() => handleRangeChange('90')}>Last 90 days</a></li>
              <li><a onClick={() => handleRangeChange('365')}>Last year</a></li>
            </ul>
          </div>
          <a
            href="#"
            className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-houseBlue hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2"
          >
            Sales Report
            <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardProfitsGraph;
