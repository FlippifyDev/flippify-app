import React, { useEffect } from 'react';
import ApexCharts from 'apexcharts';

interface DashboardProfitsChartProps {
  salesData: { categories: string[]; series: { name: string; data: number[] }[] };
  selectedRange: string;
  currencySymbol: string;
}

const DashboardProfitsChart: React.FC<DashboardProfitsChartProps> = ({ salesData, selectedRange, currencySymbol }) => {
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
            return `${currencySymbol}${val.toFixed(2)}`;
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
        },
        y: {
          formatter: (val: number) => `${currencySymbol}${val.toFixed(2)}`,
        },
      },
    };

    const chart = new ApexCharts(document.querySelector('#area-chart'), options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [salesData, selectedRange, currencySymbol]);

  return <div id="area-chart"></div>;
};

export default DashboardProfitsChart;
