"use client"

// Local Imports
import { IEbayOrder } from "@/models/store-data";
import DateRangeSelector from "./DateRangeSelector";
import { formatTimeFrom } from "@/utils/format-dates";
import { fetchChartOptions } from "./fetchChartOptions";
import { retrieveUserOrders } from "@/services/firebase/retrieve";
import { useHorizontalScroll } from "@/utils/useHorizontalScroll";

// External Imports
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import ApexCharts from "apexcharts";
import { filterOrdersByTime } from "@/utils/filters";
import Card from "./Card";


interface CardPlatformPieChartProps {
    orders: IEbayOrder[];   
}


const CardPlatformPieChart: React.FC<CardPlatformPieChartProps> = ({ orders }) => {
    const scrollRef = useHorizontalScroll<HTMLDivElement>();

    // User data
    const { data: session } = useSession();
    const [localOrders, setLocalOrders] = useState<IEbayOrder[]>(orders);

    // Chart options
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const chartRef = useRef<HTMLDivElement>(null);
    const [options, setOptions] = useState<any>({});

    // Time ranges
    const [timeFrom, setTimeFrom] = useState(formatTimeFrom(7));
    const [selectedTimeRange, setSelectedTimeRange] = useState("Last 7 days");


    // Using useEffect to initialize the chart only once when the component is mounted
    useEffect(() => {
        const filteredOrders = filterOrdersByTime(orders, timeFrom);
        setLocalOrders(filteredOrders);
    }, [timeFrom, orders]);

    useEffect(() => {
        if (localOrders.length > 0) {
            const chartOptions = fetchChartOptions(localOrders);
            setOptions(chartOptions);
        }
    }, [localOrders]);

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
        const filteredOrders = updatedTags.length === 0 ? localOrders : localOrders.filter(order => order.customTag !== null && updatedTags.includes(order.customTag));

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

        // Refetch localOrders when time range changes
        fetchOrders(formattedDate);
    };

    const fetchOrders = async (fromDate: string) => {
        if (!session || !session.user.id || !session.user.connectedAccounts.ebay?.ebayAccessToken) {
            return;
        }

        const localOrders = await retrieveUserOrders(
            session.user.id,
            fromDate,
            session.user.connectedAccounts.ebay.ebayAccessToken
        );

        setLocalOrders(localOrders);

        // If no localOrders, clear the chart
        if (localOrders.length === 0) {
            setOptions({
                series: [],
                labels: [],
            });
        } else {
            const chartOptions = fetchChartOptions(localOrders);
            setOptions(chartOptions);
        }
    };

    return (
        <Card title="Platform Revenue">
            {/* Chart Options */}
            <div className="flex overflow-x-auto scrollbar-hide" id="devices" ref={scrollRef}>
                {Array.from(
                    new Set(
                        localOrders
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

            {/* Chart */}
            <div ref={chartRef} className="py-6" id="donut-chart"></div>

            {/* Dropdown */}
            <DateRangeSelector value={selectedTimeRange} onChange={handleTimeRangeChange} />
        </Card>
    )
}

export default CardPlatformPieChart
