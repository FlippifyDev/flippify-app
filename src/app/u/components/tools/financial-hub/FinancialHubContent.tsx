"use client";

// Local Imports
import { IEbayOrder } from "@/models/store-data";
import CardAvgTimeToSell from "./CardAvgTimeToSell";
import CardAvgTimeToList from "./CardAvgTimeToList";
import DateRangeSelector from "./DateRangeSelector";
import { formatTimeFrom } from "@/utils/format-dates";
import CardListingsAmount from "./CardListingsAndOrdersAmount";
import { currencySymbols } from "@/config/currency-config";
import CardPlatformPieChart from "./CardPlatformDonutChart";
import { retrieveUserOrders } from "@/services/firebase/retrieve";

// External Imports
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";



const FinancialHubContent = () => {
    const [timeFrom, setTimeFrom] = useState(formatTimeFrom(30));
    const [timeTo, setTimeTo] = useState<string | undefined>(undefined);
    const { data: session } = useSession();
    const [orders, setOrders] = useState<IEbayOrder[]>([]);
    const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 days");
    const [loading, setLoading] = useState(false);
    const userCurrency = session?.user.preferences.currency || "USD";

    // Using useEffect to initialize the chart only once when the component is mounted
    useEffect(() => {
        async function fetchOrders() {
            if (!session || !session.user.id || !session.user.connectedAccounts.ebay?.ebayAccessToken) {
                return;
            }

            setLoading(true);
            const orders = await retrieveUserOrders(session.user.id, timeFrom, session.user.connectedAccounts.ebay.ebayAccessToken, timeTo);
            setOrders(orders);  // Set the orders to state
            setLoading(false); 
        }

        if (timeFrom) {
            fetchOrders();
        }
    }, [session, timeFrom, timeTo]);


    const handleTimeRangeChange = (label: string, days: string) => {
        setSelectedTimeRange(label);

        // Get today's date for timeTo
        const today = new Date();
        let timeFromDate = new Date(); // Default: today
        let timeToDate = today; // Default: today as timeTo

        // Set start and end of the day for the date range
        const setStartOfDay = (date: Date) => {
            date.setHours(0, 0, 0, 0); // Set to start of the day (00:00:00)
        };

        const setEndOfDay = (date: Date) => {
            date.setHours(23, 59, 59, 999); // Set to end of the day (23:59:59)
        };

        switch (label) {
            case "Today":
                timeFromDate = today;
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Yesterday":
                timeFromDate.setDate(today.getDate() - 1);
                setStartOfDay(timeFromDate);
                timeToDate = new Date(timeFromDate);
                setEndOfDay(timeToDate);
                break;

            case "Last week":
                // Set timeFrom to the start of the previous week (last Monday)
                const lastWeekStart = new Date(today);
                lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
                setStartOfDay(lastWeekStart);
                timeFromDate = lastWeekStart;

                const lastWeekEnd = new Date(lastWeekStart);
                lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
                setEndOfDay(lastWeekEnd);
                timeToDate = lastWeekEnd;
                break;

            case "Last month":
                // Set timeFrom to the first day of the previous month
                timeFromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                timeToDate = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month
                break;

            case "Last year":
                // Set timeFrom to the first day of the previous year
                timeFromDate = new Date(today.getFullYear() - 1, 0, 1); // Jan 1 of last year
                timeToDate = new Date(today.getFullYear() - 1, 11, 31); // Dec 31 of last year
                break;

            case "Last 24 hours":
                timeFromDate.setDate(today.getDate() - 1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Last 7 days":
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Last 30 days":
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Last 90 days":
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "Week to date":
                // Start of the current week (Sunday)
                timeFromDate.setDate(today.getDate() - today.getDay());
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "Month to date":
                // Start of the current month
                timeFromDate.setDate(1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "Year to date":
                // Start of the current year
                timeFromDate = new Date(today.getFullYear(), 0, 1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "All Time":
                // Set timeFrom to a date far in the past
                timeFromDate = new Date(2000, 0, 1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            default:
                timeFromDate.setDate(today.getDate() - parseInt(days)); // Fallback for custom ranges
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
        }

        // Format timeFrom and timeTo to ISO date format (YYYY-MM-DD)
        const formattedFromDate = timeFromDate.toISOString().split("T")[0];
        const formattedToDate = timeToDate.toISOString().split("T")[0];

        // Set new timeFrom and timeTo
        setTimeFrom(formattedFromDate);
        setTimeTo(formattedToDate);
    };

    console.log(orders)


    return (
        <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
            <div className="w-full flex flex-col">
                <div className="w-full p-2 bg-white border-t flex items-center">
                    <div>
                        <DateRangeSelector value={selectedTimeRange} onChange={handleTimeRangeChange} />
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-4 p-2 sm:p-4">
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <CardListingsAmount />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <CardPlatformPieChart orders={orders} loading={loading} currencySymbol={currencySymbols[userCurrency]}/>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4 grid grid-rows-12 grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                            <CardAvgTimeToSell orders={orders} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <CardAvgTimeToList orders={orders} />
                        </div>
                    </div>
                </div>
            </div>
        </LayoutSubscriptionWrapper>
    );
};

export default FinancialHubContent;
