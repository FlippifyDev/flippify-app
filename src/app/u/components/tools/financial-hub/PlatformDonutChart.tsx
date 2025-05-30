"use client"

// Local Imports
import Card from '../../dom/ui/Card';
import { IOrder } from "@/models/store-data";
import { fetchChartOptions } from "./fetchChartOptions";
import { useHorizontalScroll } from "@/utils/useHorizontalScroll";

// External Imports
import { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import LoadingSpinner from '@/app/components/LoadingSpinner';
import NoResultsFound from '../../dom/ui/NoResultsFound';

interface CardPlatformDonutChartProps {
    orders: IOrder[];
    loading: boolean;
    currencySymbol: string;
}


const CardPlatformDonutChart: React.FC<CardPlatformDonutChartProps> = ({ orders, loading, currencySymbol }) => {
    const scrollRef = useHorizontalScroll<HTMLDivElement>();

    // Chart options
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [options, setOptions] = useState<any>({});

    useEffect(() => {
        if (orders.length > 0) {
            const chartOptions = fetchChartOptions(orders, currencySymbol);
            setOptions(chartOptions);
        }
    }, [orders, currencySymbol]);

    useEffect(() => {
        // Safety checks for chartRef and options.series
        if (
            chartRef.current &&
            typeof ApexCharts !== "undefined" &&
            options?.series &&
            Array.isArray(options.series) &&
            options.series.length > 0
        ) {
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();

            // Cleanup on unmount
            return () => {
                chart.destroy();
            };
        }
    }, [options]);

    // Function to handle the checkbox change event
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        let updatedTags = [...selectedTags];
        if (checked) {
            updatedTags.push(value);
        } else {
            updatedTags = updatedTags.filter(tag => tag !== value);
        }

        setSelectedTags(updatedTags);

        // If no tags are selected, use all localOrders
        const filteredOrders = updatedTags.length === 0 ? orders : orders.filter(order => order.customTag !== null && updatedTags.includes(order.customTag ?? ""));

        // Aggregate and update chart data
        const chartOptions = fetchChartOptions(filteredOrders, currencySymbol);
        setOptions(chartOptions);
    };



    return (
        <Card title="Platform Revenue">
            <div className="h-[500px]">
                {/* Chart Options */}
                {loading ? (
                    <div className="h-full flex items-center justify-center"><LoadingSpinner /></div>
                ) : (
                    <div className="flex overflow-x-auto scrollbar-hide mb-5" id="devices" ref={scrollRef}>
                        {Array.from(
                            new Set(
                                orders
                                    .map(order => order.customTag)
                                    .filter(tag => tag !== null && tag !== undefined && tag !== "")
                            )
                        ).map(tag => (
                            <div className="flex items-center me-4 h-6 ml-1" key={tag}>
                                <input
                                    id={tag as string}
                                    type="checkbox"
                                    onChange={handleCheckboxChange}
                                    value={tag as string}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"
                                />
                                <label htmlFor={tag as string} className="ms-2 text-sm font-medium text-gray-900">
                                    {tag}
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                {/* Chart */}
                {orders.length > 0 && !loading ? (
                    <div ref={chartRef} className="py-6" id="donut-chart"></div>
                ) : (
                    null
                )}

                {orders.length === 0 && !loading && (
                    <div className='flex justify-center'>
                        <NoResultsFound />
                    </div>
                )}
            </div>
        </Card>
    )
}

export default CardPlatformDonutChart
