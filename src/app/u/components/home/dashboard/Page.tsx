"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";

import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import DashboardRecentSalesCard from "./DashboardRecentSalesCard";
import { retrieveIdToken, retrieveUserInventory, retrieveUserOneTimeExpenses, retrieveUserOrders } from "@/services/firebase/retrieve";
import ProfitsGraphDateFilter from "./ProfitsGraphDateFilter";
import LayoutLoadingSkeleton from "../../layout/LayoutLoadingSkeleton";
import ProfitsGraphTagFilter from "./ProfitsGraphTagFilter";
import DashboardOverviewCard from "./DashboardOverviewCard";
import DashboardProfitsGraph from "./DashboardProfitsGraph";
import IconButton from "../../dom/ui/IconButton";
import { IListing, IOrder } from "@/models/store-data";
import OnboardingFlow from "./OnboardingFlow";
import { defaultTimeFrom } from "@/utils/constants";
import { retrieveUserStoreTypes } from "@/services/firebase/retrieve-admin";
import { IOneTimeExpense } from "@/models/expenses";
import { formatTimeFrom } from "@/utils/format-dates";


const DashboardPage: React.FC = () => {
    const { data: session } = useSession();
    const currency = session?.user.preferences?.currency as string;

    const [inventoryData, setInventoryData] = useState<IListing[]>([]);
    const [salesData, setSalesData] = useState<IOrder[]>([]);
    const [oneTimeExpensesData, setOneTimeExpensesData] = useState<IOneTimeExpense[]>([]);
    const [selectedRange, setSelectedRange] = useState<number>(30);
    const [selectedLabel, setSelectedLabel] = useState<string>("This Month");

    const rangeDropdownRef = useRef<HTMLDivElement | null>(null);
    const tagDropdownRef = useRef<HTMLDivElement | null>(null);

    // State for the selected custom tag
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const [timeFrom, setTimeFrom] = useState(formatTimeFrom(30));
    const [timeTo, setTimeTo] = useState(new Date().toISOString());

    const handleRangeChange = (range: string, label: string) => {
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
            case "This Week":
                // Start of the current week (Sunday)
                timeFromDate.setDate(today.getDate() - today.getDay());
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "This Month":
                // Start of the current month
                timeFromDate.setDate(1);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;
            case "Last 3 Months":
                timeFromDate.setDate(today.getDate() - 90);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "Last 6 Months":
                timeFromDate.setDate(today.getDate() - 180);
                setStartOfDay(timeFromDate);
                timeToDate = today;
                setEndOfDay(timeToDate);
                break;

            case "This Year":
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
        }

        setTimeFrom(timeFromDate.toISOString());
        setTimeTo(timeToDate.toISOString());
        setSelectedLabel(label)
        setSelectedRange(Number(range));
    };

    // Extract unique custom tags from sales data for filtering
    const uniqueTags = Array.from(
        new Set(salesData.map((order) => order.customTag))
    ).filter((tag) => tag != null);

    useEffect(() => {
        const fetchSalesData = async () => {
            if (!session) return;

            const idToken = await retrieveIdToken();
            if (!idToken) return;
            const storeTypes = await retrieveUserStoreTypes({ idToken, itemType: "orders" });
            if (!storeTypes) return;

            const orderResults = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserOrders({
                        uid: session.user.id as string,
                        timeFrom: timeFrom,
                        timeTo: timeTo,
                        storeType,
                    }).then((order) => [storeType, order] as const);
                })
            );
            const orders = orderResults[orderResults.length - 1]?.[1] ?? [];
            setSalesData(orders);
        };

        const fetchInventoryData = async () => {
            if (!session) return;

            const idToken = await retrieveIdToken();
            if (!idToken) return;
            
            const storeTypes = await retrieveUserStoreTypes({ idToken, itemType: "inventory" });
            if (!storeTypes) return;

            const inventoryResults = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserInventory({
                        uid: session.user.id as string,
                        timeFrom: defaultTimeFrom,
                        storeType,
                    }).then((item) => [storeType, item] as const);
                })
            );
            const inventory = inventoryResults[inventoryResults.length - 1]?.[1] ?? [];

            if (inventory) {
                setInventoryData(inventory);
            }
        };

        const fetchOneTimeExpenseData = async () => {
            if (!session) return;

            const items = await retrieveUserOneTimeExpenses({
                uid: session?.user.id as string,
                timeFrom: timeFrom,
                timeTo: timeTo,
            })

            setOneTimeExpensesData(items);
        }

        if (session?.user.authentication?.subscribed) {
            fetchSalesData();
            fetchInventoryData();
            fetchOneTimeExpenseData();
        }
    }, [session, timeFrom, timeTo]);


    if (!session || !session.user || !session.user.stripeCustomerId) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <LayoutLoadingSkeleton />
            </div>
        );
    }

    // Filter sales data based on the selected tag
    const filteredSalesData = selectedTag
        ? salesData.filter((order) => order.customTag === selectedTag)
        : salesData;

    if (session.user.authentication?.onboarding) {
        return (
            <div className="h-full">
                <OnboardingFlow />
            </div>
        )
    }

    return (
        <div className="relative flex flex-col w-full min-h-full">
            {/* If They Have Access but NO Subscription*/}
            <LayoutSubscriptionWrapper
                requiredSubscriptions={["accessGranted", "!member", "!admin"]}
            >
                <IconButton heading="No subscription connected" animationType="hover-box" subtitle="Go to the plans page to get a subscription" buttonText="View Plans" redirect="plans" />
            </LayoutSubscriptionWrapper>

            {/* If They Have Subscription */}
            <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
                <div className="h-full w-full flex flex-col gap-2 sm:gap-4">
                    <div className="w-full">
                        <DashboardOverviewCard
                            salesData={filteredSalesData}
                            inventoryData={inventoryData}
                            oneTimeExpensesData={oneTimeExpensesData}
                            currency={currency}
                            selectedRange={selectedRange}
                        />
                    </div>
                    <div className="w-full bg-white shadow rounded-lg dark:bg-gray-800 p-4 md:p-6">
                        <DashboardProfitsGraph
                            salesData={filteredSalesData}
                            oneTimeExpensesData={oneTimeExpensesData}
                            currency={currency}
                            selectedRange={selectedRange}
                        />
                        {/* Dropdown for selecting tags */}
                        <div className="flex flex-row w-full gap-4">
                            {/* Dropdown for selecting date range */}
                            <ProfitsGraphDateFilter ref={rangeDropdownRef} selectedLabel={selectedLabel} selectedRange={selectedRange} handleRangeChange={handleRangeChange} />

                            {/* Dropdown for selecting custom tag */}
                            <ProfitsGraphTagFilter ref={tagDropdownRef} selectedTag={selectedTag} uniqueTags={uniqueTags} setSelectedTag={setSelectedTag} />
                        </div>
                    </div>
                    <div className="w-full">
                        <DashboardRecentSalesCard
                            salesData={filteredSalesData}
                            currency={currency}
                        />
                    </div>
                </div>
            </LayoutSubscriptionWrapper>
        </div>
    );
};

export default DashboardPage;
