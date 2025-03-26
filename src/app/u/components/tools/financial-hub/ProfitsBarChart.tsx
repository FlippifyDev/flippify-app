"use client"

// Local Imports
import { IEbayOrder } from '@/models/store-data';
import { fetchBarChartOptions } from './fetchBarChartOptions';

// External Imports
import { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import Card from './Card';

interface CardProfitsBarChartProps {
    orders: IEbayOrder[];
    loading: boolean;
    currencySymbol: string;
}

const CardProfitsBarChart: React.FC<CardProfitsBarChartProps> = ({ orders, loading, currencySymbol }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [options, setOptions] = useState<any>(null);

    useEffect(() => {
        if (orders.length > 0) {
            const chartOptions = fetchBarChartOptions(orders, currencySymbol);
            setOptions(chartOptions);
        }
    }, [orders, currencySymbol]);

    useEffect(() => {
        // Check if chartRef and options are valid before rendering
        if (chartRef.current && options && options.series?.length > 0) {
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();

            // Cleanup chart instance on component unmount or re-render
            return () => {
                chart.destroy();
            };
        }
    }, [options]);

    // Dummy values for profit, income, and expense (can be dynamically calculated)
    const totalIncome = orders.reduce((acc, order) => acc + (order.sale.price * order.sale.quantity), 0).toFixed(2);
    const totalExpense = orders.reduce((acc, order) => acc + ((order.purchase.price ?? 0) + order.shipping.fees + order.additionalFees), 0).toFixed(2);
    const totalProfit = (parseFloat(totalIncome) - parseFloat(totalExpense)).toFixed(2);
    const profitRate = ((parseFloat(totalProfit) / parseFloat(totalIncome)) * 100).toFixed(1);

    return (
        <Card title="Profits">
            <div className='h-[500px]'>
                {/* Profit Summary */}
                <div className="flex justify-between border-gray-200 border-b pb-3">
                    <dl>
                        <dt className="text-base font-normal text-gray-500 pb-1">Profit</dt>
                        <dd className="leading-none text-3xl font-bold text-gray-900">
                            {currencySymbol}{totalProfit}
                        </dd>
                    </dl>
                    <div>
                        <span className="bg-houseFinancialHub text-white text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
                            <svg
                                className="w-2.5 h-2.5 mr-1.5"
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
                            Profit rate {profitRate}%
                        </span>
                    </div>
                </div>

                {/* Income and Expense Summary */}
                <div className="grid grid-cols-2 py-3">
                    <dl>
                        <dt className="text-base font-normal text-gray-500 pb-1">Income</dt>
                        <dd className="leading-none text-xl font-bold text-[#0D3B66]">
                            {currencySymbol}{totalIncome}
                        </dd>
                    </dl>
                    <dl>
                        <dt className="text-base font-normal text-gray-500 pb-1">Expense</dt>
                        <dd className="leading-none text-xl font-bold text-[#89C2D9]">
                            -{currencySymbol}{totalExpense}
                        </dd>
                    </dl>
                </div>

                {/* Bar Chart */}
                <div ref={chartRef} id="bar-chart" className="mt-4"></div>
            </div>
        </Card>
    )
}

export default CardProfitsBarChart;
