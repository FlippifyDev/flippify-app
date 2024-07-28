import React, { useEffect, useState, useCallback } from 'react';
import ApexCharts from 'apexcharts';
import { database, ref, get } from "../../api/auth-firebase/firebaseConfig";
import { ISale } from "./SalesTrackerModels";
import { format, subDays, eachDayOfInterval, eachMonthOfInterval, endOfDay, parse } from 'date-fns';

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



interface DashboardProfitsGraphProps {
  customerId: string;
}

const DashboardProfitsGraph: React.FC<DashboardProfitsGraphProps> = ({ customerId }) => {
  const [salesData, setSalesData] = useState<SalesData>({
    categories: [],
    series: []
  });
  const [netProfit, setNetProfit] = useState(0);
  const [previousNetProfit, setPreviousNetProfit] = useState(0);
  const [selectedRange, setSelectedRange] = useState('30');

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
            continue; // Skip this sale if the date is invalid
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

          // Include current day’s sales in net profit calculation
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
    fetchSalesData(parseInt(selectedRange));
  }, [customerId, selectedRange, fetchSalesData]);

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
            const date = new Date(val);
            if (isNaN(date.getTime())) {
              return '';
            }
            if (selectedRange === '30') {
              return '';
            } else if (selectedRange === '90') {
              return '';
            } else if (selectedRange === '365') {
              return '';
            }
            return format(date, 'd');
          },
          cssClass: 'text-xs text-gray-500'
        },
        tooltip: {
          enabled: selectedRange === '90',
          formatter: (val: string, opts: TooltipFormatterOpts) => {
            const date = new Date(salesData.categories[opts.dataPointIndex]);
            if (isNaN(date.getTime())) {
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

    const chart = new ApexCharts(document.querySelector('#area-chart'), options);
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
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-5">
          <div className="dropdown dropdown-hover bg-white">
            <div tabIndex={0} role="button" className="btn m-1 text-lightModeText bg-white hover:bg-gray-100">Last {selectedRange} days</div>
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
      </div>
    </div>
  );
};

export default DashboardProfitsGraph;