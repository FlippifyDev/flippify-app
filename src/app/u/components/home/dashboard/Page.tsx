"use client";

// External Imports
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";

// Local Imports
import { retrieveUserInventory, retrieveUserOrders } from "@/services/firebase/retrieve";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import DashboardRecentSalesCard from "./DashboardRecentSalesCard";
import ProfitsGraphDateFilter from "./ProfitsGraphDateFilter";
import LayoutLoadingSkeleton from "../../layout/LayoutLoadingSkeleton";
import ProfitsGraphTagFilter from "./ProfitsGraphTagFilter";
import DashboardOverviewCard from "./DashboardOverviewCard";
import DashboardProfitsGraph from "./DashboardProfitsGraph";
import { IListing, IOrder } from "@/models/store-data";
import { fetchUserStores } from "@/utils/extract-user-data";
import { defaultTimeFrom } from "@/utils/constants";
import OnboardingFlow from "./OnboardingFlow";
import IconButton from "../../dom/ui/IconButton";


const DashboardPage: React.FC = () => {
    const { data: session } = useSession();
    const currency = session?.user.preferences?.currency as string;

    const [inventoryData, setInventoryData] = useState<IListing[]>([]);
    const [salesData, setSalesData] = useState<IOrder[]>([]);
    const [selectedRange, setSelectedRange] = useState<number>(30);
    const [selectedLabel, setSelectedLabel] = useState<string>("This Month");

    const rangeDropdownRef = useRef<HTMLDivElement | null>(null);
    const tagDropdownRef = useRef<HTMLDivElement | null>(null);

    // State for the selected custom tag
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const handleRangeChange = (range: string, label: string) => {
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

            const storeTypes = fetchUserStores(session.user);

            const orderResults = await Promise.all(
                storeTypes.map((storeType) => {
                    return retrieveUserOrders({
                        uid: session.user.id as string,
                        timeFrom: defaultTimeFrom,
                        storeType,
                    }).then((order) => [storeType, order] as const);
                })
            );
            const orders = orderResults[orderResults.length - 1]?.[1] ?? [];

            if (orders) {
                setSalesData(orders);
            }
        };

        const fetchInventoryData = async () => {
            if (!session) return;
            const storeTypes = fetchUserStores(session.user);

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

        if (session?.user.authentication?.subscribed) {
            fetchSalesData();
            fetchInventoryData();
        }
    }, [session]);


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
                            currency={currency}
                            selectedRange={selectedRange}
                        />
                    </div>
                    <div className="w-full bg-white shadow rounded-lg dark:bg-gray-800 p-4 md:p-6">
                        <DashboardProfitsGraph
                            salesData={filteredSalesData}
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
