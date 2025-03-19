"use client"

// Local Imports
import { IEbayOrder } from "@/models/store-data";
import DateRangeSelector from "./DateRangeSelector";
import { fetchChartOptions } from "./fetchChartOptions";
import { retrieveUserOrders } from "@/services/firebase/retrieve";
import { useHorizontalScroll } from "@/utils/useHorizontalScroll";

// External Imports
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import ApexCharts from "apexcharts";


const getTimeFrom = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};



const CardPlatformPieChart = () => {
    const scrollRef = useHorizontalScroll<HTMLDivElement>();

    // User data
    const { data: session } = useSession();
    const [orders, setOrders] = useState<IEbayOrder[]>([]);

    // Chart options
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const chartRef = useRef<HTMLDivElement>(null);
    const [options, setOptions] = useState<any>({});

    // Time ranges
    const [timeFrom, setTimeFrom] = useState(getTimeFrom(7));
    const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 days");


    // Using useEffect to initialize the chart only once when the component is mounted
    useEffect(() => {
        async function fetchData() {
            if (!session || !session.user.id || !session.user.connectedAccounts.ebay?.ebayAccessToken) {
                return;
            }

            const orders = await retrieveUserOrders(session.user.id, timeFrom, session.user.connectedAccounts.ebay.ebayAccessToken);
            setOrders(orders);  // Set the orders to state
        }

        fetchData();
    }, [session]);

    useEffect(() => {
        if (orders.length > 0) {
            const chartOptions = fetchChartOptions(orders);
            setOptions(chartOptions);
        }
    }, [orders]);

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

        // If no tags are selected, use all orders
        const filteredOrders = updatedTags.length === 0 ? orders : orders.filter(order => updatedTags.includes(order.customTag));

        // Aggregate and update chart data
        const chartOptions = fetchChartOptions(filteredOrders);
        setOptions(chartOptions);
    };

    const handleTimeRangeChange = (label: string, days: string) => {
        setSelectedTimeRange(label);

        // Calculate the date based on the selected days
        const date = new Date();
        date.setDate(date.getDate() - parseInt(days));
        const formattedDate = date.toISOString().split("T")[0];

        // Set the new timeFrom value
        setTimeFrom(formattedDate);

        // Refetch orders when time range changes
        fetchOrders(formattedDate);
    };

    const fetchOrders = async (fromDate: string) => {
        if (!session || !session.user.id || !session.user.connectedAccounts.ebay?.ebayAccessToken) {
            return;
        }

        const orders = await retrieveUserOrders(
            session.user.id,
            fromDate,
            session.user.connectedAccounts.ebay.ebayAccessToken
        );

        setOrders(orders);

        // If no orders, clear the chart
        if (orders.length === 0) {
            setOptions({
                series: [],
                labels: [],
            });
        } else {
            const chartOptions = fetchChartOptions(orders);
            setOptions(chartOptions);
        }
    };

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">

            <div className="flex justify-between mb-3">
                <div className="flex justify-center items-center">
                    {/* Title */}
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">Platform Revenue</h5>
                    <svg data-popover-target="chart-info" data-popover-placement="bottom" className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z" />
                    </svg>

                    {/* Popover */}
                    <div data-popover id="chart-info" role="tooltip" className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
                        <div className="p-3 space-y-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Activity growth - Incremental</h3>
                            <p>Report helps navigate cumulative growth of community activities. Ideally, the chart should have a growing trend, as stagnating chart signifies a significant decrease of community activity.</p>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Calculation</h3>
                            <p>For each date bucket, the all-time volume of activities is calculated. This means that activities in period n contain all activities up to period n, plus the activities generated by your community in period.</p>
                            <a href="#" className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline">Read more <svg className="w-2 h-2 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg></a>
                        </div>
                        <div data-popper-arrow></div>
                    </div>
                </div>
            </div>

            {/* Chart Options */}
            <div className="flex overflow-x-auto scrollbar-hide" id="devices" ref={scrollRef}>
                {Array.from(
                    new Set(
                        orders
                            .map(order => order.customTag)
                            .filter(tag => tag !== null && tag !== undefined && tag !== "")
                    )
                ).map(tag => (
                    <div className="flex items-center me-4 h-6" key={tag}>
                        <input
                            id={tag}
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            value={tag}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label htmlFor={tag} className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {tag}
                        </label>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div ref={chartRef} className="py-6" id="donut-chart"></div>

            {/* Dropdown */}
            <DateRangeSelector value={selectedTimeRange} onChange={handleTimeRangeChange} />
        </div>
    )
}

export default CardPlatformPieChart
