"use client";

// Local Imports
import OrderInfo from "./OrderInfo";
import FilterSelector from "./FilterSelector";
import { IEbayOrder } from "@/models/store-data";
import CardShippingInfo from "./ShippingInfo";
import CardCostAverages from "./CostAverages";
import CardSaleAverages from "./SaleAverages";
import DateRangeSelector from "./DateRangeSelector";
import { formatTimeFrom } from "@/utils/format-dates";
import CardListingsAmount from "./ListingsAndOrdersAmount";
import CardProfitsBarChart from "./ProfitsBarChart";
import { currencySymbols } from "@/config/currency-config";
import IconButton from "../../dom/ui/IconButton";
import CardPlatformDonutChart from "./PlatformDonutChart";
import { retrieveUserOrders } from "@/services/firebase/retrieve";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import { formatOrdersForCSVExport } from "@/utils/format";
import { defaultTimeFrom, exportCSVAllowedSubscriptionPlans } from "@/utils/constants";

// External Imports
import { useEffect, useState } from "react";
import { HiOutlineDownload } from "react-icons/hi";
import { useSession } from "next-auth/react";
import Modal from "../../dom/ui/Modal";
import Link from "next/link";



const Page = () => {
    const { data: session } = useSession();

    const [orders, setOrders] = useState<IEbayOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const subscribed = session?.user.authentication.subscribed;

    // General Filters
    const [selectedFilter, setSelectedFilter] = useState("eBay");
    const [selectedTimeRange, setSelectedTimeRange] = useState("Last 30 days");
    const [timeFrom, setTimeFrom] = useState(formatTimeFrom(30));
    const [timeTo, setTimeTo] = useState<string>(new Date().toISOString());

    const userCurrency = session?.user.preferences.currency || "USD";

    // Export CSV Modal
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportTimeFrom, setExportTimeFrom] = useState<string>(timeFrom);
    const [exportTimeTo, setExportTimeTo] = useState<string>(timeTo);
    const [error, setError] = useState<string | undefined>(undefined);

    // Using useEffect to initialize the chart only once when the component is mounted
    useEffect(() => {
        async function fetchOrders() {
            if (!session || !session.user.id || !session.user.connectedAccounts.ebay?.ebayAccessToken) {
                return;
            }

            setLoading(true);
            const orders = await retrieveUserOrders({
                uid: session?.user.id as string,
                timeFrom: defaultTimeFrom,
                ebayAccessToken: session?.user.connectedAccounts.ebay?.ebayAccessToken as string,
            });
            setOrders(orders);  // Set the orders to state
            setLoading(false);
        }

        if (subscribed) {
            fetchOrders();
        }
    }, [session, timeFrom, timeTo, subscribed]);


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
                timeFromDate = new Date(2020, 0, 1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            default:
                timeFromDate.setDate(today.getDate() - parseInt(days));
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
        }

        setExportTimeFrom(timeFromDate.toLocaleDateString('en-CA'));
        setExportTimeTo(timeToDate.toLocaleDateString('en-CA'));
        setTimeFrom(timeFromDate.toISOString());
        setTimeTo(timeToDate.toISOString());
    };

    // Handle the date change for 'timeFrom'
    const handleTimeFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExportTimeFrom(e.target.value);
    };

    // Handle the date change for 'timeTo'
    const handleTimeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExportTimeTo(e.target.value);
    };

    const handleFilterChange = (type: string) => {
        setSelectedFilter(type);
    }

    function handleExportCSV() {
        setError(undefined);
        // Get the CSV string from formatOrdersForCSVExport
        const csvContent = formatOrdersForCSVExport(orders, exportTimeFrom ?? "", exportTimeTo ?? "");
        if (!csvContent) {
            setError("No orders found in the selected time range");
            return;
        }

        // Create a Blob from the CSV content
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        // Create a temporary link element to trigger download
        const link = document.createElement("a");
        link.href = url;

        // Set download file name with a timestamp
        const fileName = `orders-${new Date().toISOString().split("T")[0]}.csv`;
        link.setAttribute("download", fileName);

        // Append link to body and trigger download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    const handleCloseModal = () => {
        setExportModalOpen(false);
    };

    return (
        <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
            {session?.user.connectedAccounts.ebay ? (
                <div className="relative w-full flex flex-col">
                    <div className="w-full py-2 px-4 bg-white border-t flex items-center">
                        <div>
                            <FilterSelector value={selectedFilter} onChange={handleFilterChange} />
                        </div>
                        <div className="w-full flex items-center justify-end gap-2">
                            <div>
                                <DateRangeSelector value={selectedTimeRange} onChange={handleTimeRangeChange} />
                            </div>
                            <button
                                onClick={() => setExportModalOpen(true)}
                                className="flex items-center justify-center p-2 bg-houseFinancialHub text-white rounded-lg transition-colors duration-300 hover:bg-houseFinancialHubHover"
                            >
                                <HiOutlineDownload className="h-5 w-5 sm:h-4 sm:w-4" />
                                <span className="ml-1 text-sm hidden sm:block">Export</span>
                            </button>
                        </div>
                    </div>

                    {/* Export Modal */}
                    {exportModalOpen && (
                        <Modal title="Export Data" setDisplayModal={setExportModalOpen}>
                            {subscribed && exportCSVAllowedSubscriptionPlans.includes(subscribed) ? (
                                <div className="text-center">
                                    <p>You&apos;re about to export a CSV file containing your orders</p>
                                    {/* Date Selectors */}
                                    <div className="mt-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-2 flex-col sm:flex-row">
                                                <div className="flex-1">
                                                    <label htmlFor="timeFrom" className="block text-sm font-medium text-gray-700">Time From</label>
                                                    <input
                                                        type="date"
                                                        id="timeFrom"
                                                        value={exportTimeFrom.split('T')[0]}
                                                        onChange={(e) => handleTimeFromChange(e)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label htmlFor="timeTo" className="block text-sm font-medium text-gray-700">Time To</label>
                                                    <input
                                                        type="date"
                                                        id="timeTo"
                                                        value={exportTimeTo?.split('T')[0]}
                                                        onChange={(e) => handleTimeToChange(e)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {error ? (
                                        <p className="text-sm mt-6">{error}</p>
                                    ) : (
                                        null
                                    )}
                                    <div className="flex justify-center gap-4 mt-6">
                                        <button
                                            onClick={handleExportCSV}
                                            className="flex items-center py-2 px-4 bg-houseFinancialHub text-white rounded-md hover:bg-houseFinancialHubHover transition duraction-200"
                                        >
                                            <HiOutlineDownload className="h-4 w-4" />
                                            <span className="ml-1 text-sm">Export CSV</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4 flex flex-col items-center">
                                    <p className="text-sm text-center">You need a paid subscription to export data</p>
                                    <p className="text-sm text-center">Please upgrade your plan to access this feature</p>
                                    <Link href={`/u/${session.user.username}/plans`} className="bg-houseBlue max-w-[120px] p-3 hover:bg-houseHoverBlue transition duraction-200 text-white text-sm rounded-lg">
                                        Upgrade Plan
                                    </Link>
                                </div>
                            )}

                        </Modal>

                    )}

                    <div className="grid grid-cols-12 gap-4 p-2 sm:p-4">
                        <CardSaleAverages orders={orders} loading={loading} currencySymbol={currencySymbols[userCurrency]} />
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <CardProfitsBarChart orders={orders} loading={loading} currencySymbol={currencySymbols[userCurrency]} />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <CardPlatformDonutChart orders={orders} loading={loading} currencySymbol={currencySymbols[userCurrency]} />
                        </div>
                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                            <div className="sm:h-1/4">
                                <OrderInfo orders={orders} loading={loading} />
                            </div>
                            <div className="sm:h-3/4">
                                <CardListingsAmount />
                            </div>
                        </div>
                        <CardCostAverages orders={orders} loading={loading} currencySymbol={currencySymbols[userCurrency]} />
                        <CardShippingInfo orders={orders} loading={loading} />
                    </div>
                </div>
            ) : (
                <div className="relative flex flex-col w-full min-h-full">
                    <IconButton heading="No account connected" animationType="hover-box" subtitle="Go to your profile to connect your eBay account" buttonText="Go to profile" redirect="profile" />
                </div>
            )}

        </LayoutSubscriptionWrapper>
    );
};

export default Page;
