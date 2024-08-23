// components/DashboardProfitsChart.tsx
import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

interface DashboardProfitsChartProps {
  salesData: { categories: string[]; series: { name: string; data: number[] }[] };
  selectedRange: string;
  currency: 'GBP' | 'USD' | 'EUR';
  currencyConversionRates: Record<'GBP' | 'USD' | 'EUR', number>;
}

const DashboardProfitsChart: React.FC<DashboardProfitsChartProps> = ({ salesData, selectedRange, currency, currencyConversionRates }) => {
  useEffect(() => {
    const options = {
      chart: {
        type: 'area',
        height: 300,
        toolbar: {
          show: false,
        },
      },
      series: salesData.series,
      xaxis: {
        categories: salesData.categories,
        labels: {
          show: true,
          formatter: (val: string) => {
            const date = new Date(val);
            if (isNaN(date.getTime())) {
              return '';
            }
            return ''; // Your formatting logic here
          },
          cssClass: 'text-xs text-gray-500',
        },
        tooltip: {
          enabled: selectedRange === '90',
          formatter: (val: string, opts: { dataPointIndex: number }) => {
            const date = new Date(salesData.categories[opts.dataPointIndex]);
            if (isNaN(date.getTime())) {
              return '';
            }
            return ''; // Your formatting logic here
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          formatter: (val: number) => {
            const conversionRate = currencyConversionRates[currency];
            const convertedValue = val * conversionRate;
            const currencySymbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
            return `${currencySymbol}${convertedValue.toFixed(2)}`;
          },
          cssClass: 'text-xs text-gray-500',
        },
      },
      stroke: {
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
          formatter: (val: string, opts: { dataPointIndex: number }) => {
            const date = new Date(salesData.categories[opts.dataPointIndex]);
            if (isNaN(date.getTime())) {
              return '';
            }
            return ''; // Your formatting logic here
          },
        },
        y: {
          formatter: (val: number) => {
            const conversionRate = currencyConversionRates[currency];
            const convertedValue = val * conversionRate;
            const currencySymbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : '€';
            return `${currencySymbol}${convertedValue.toFixed(2)}`;
          },
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#area-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [salesData, selectedRange, currency]);

  return <div id="area-chart"></div>;
};

export default DashboardProfitsChart;
