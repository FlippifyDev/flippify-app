"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";

import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import DashboardRecentSalesCard from "./DashboardRecentSalesCard";
import ProfitsGraphDateFilter from "./ProfitsGraphDateFilter";
import { retrieveUserOrders } from "@/services/firebase/retrieve";
import LayoutLoadingSkeleton from "../../layout/LayoutLoadingSkeleton";
import ProfitsGraphTagFilter from "./ProfitsGraphTagFilter";
import DashboardOverviewCard from "./DashboardOverviewCard";
import DashboardProfitsGraph from "./DashboardProfitsGraph";
import OnboardingFlow from "./OnboardingFlow";
import { IEbayOrder } from "@/models/store-data";
import ConnectAccountButton from "../../dom/ui/ConnectAccountButton";


const DashboardPage: React.FC = () => {
    const { data: session } = useSession();
    const currency = session?.user.preferences.currency as string;
    const [salesData, setSalesData] = useState<IEbayOrder[]>([]);
    const [selectedRange, setSelectedRange] = useState<number>(30);
    const [selectedLabel, setSelectedLabel] = useState<string>("This Month");
    const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

    const rangeDropdownRef = useRef<HTMLDivElement | null>(null);
    const tagDropdownRef = useRef<HTMLDivElement | null>(null);

    // State for the selected custom tag
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const handleRangeChange = (range: string, label: string) => {
        setSelectedLabel(label)
        setSelectedRange(Number(range));
        setRangeDropdownOpen(false);
    };

    // Extract unique custom tags from sales data for filtering
    const uniqueTags = Array.from(
        new Set(salesData.map((order) => order.customTag))
    ).filter((tag) => tag != null);

    useEffect(() => {
        const fetchSalesData = async () => {
            const orders = await retrieveUserOrders(session?.user.id as string, "2023-01-01T00:00:00Z", session?.user.connectedAccounts.ebay?.ebayAccessToken as string);
            if (orders) {
                setSalesData(orders);
            }
        };

        if (session?.user) {
            fetchSalesData();
        }
    }, [session?.user]);

    // Close dropdowns if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                rangeDropdownRef.current &&
                !rangeDropdownRef.current.contains(event.target as Node) &&
                tagDropdownRef.current &&
                !tagDropdownRef.current.contains(event.target as Node)
            ) {
                setRangeDropdownOpen(false);
                setTagDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!session || !session.user || !session.user.stripeCustomerId) {
        return <LayoutLoadingSkeleton />;
    }

    // Filter sales data based on the selected tag
    const filteredSalesData = selectedTag
        ? salesData.filter((order) => order.customTag === selectedTag)
        : salesData;

    if (session.user.authentication.onboarding) {
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
                <ConnectAccountButton heading="No subscription connected" animationType="hover-box" subtitle="Go to the plans page to get a subscription" buttonText="View Plans" />
            </LayoutSubscriptionWrapper>

            {/* If They Have Subscription */}
            <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
                {session.user.connectedAccounts.ebay ? (
                    <div className="h-full w-full flex flex-col gap-2 sm:gap-4">
                        <div className="w-full">
                            <DashboardOverviewCard
                                salesData={filteredSalesData}
                                currency={currency}
                                selectedRange={selectedRange}
                            />
                        </div>
                        <div className="w-full bg-white rounded-lg dark:bg-gray-800 p-4 md:p-6">
                            <DashboardProfitsGraph
                                salesData={filteredSalesData}
                                currency={currency}
                                selectedRange={selectedRange}
                            />
                            {/* Dropdown for selecting tags */}
                            <div className="flex flex-row w-full gap-4">
                                {/* Dropdown for selecting date range */}
                                <ProfitsGraphDateFilter ref={rangeDropdownRef} rangeDropdownOpen={rangeDropdownOpen} selectedLabel={selectedLabel} selectedRange={selectedRange} setRangeDropdownOpen={setRangeDropdownOpen} handleRangeChange={handleRangeChange} />

                                {/* Dropdown for selecting custom tag */}
                                <ProfitsGraphTagFilter ref={tagDropdownRef} tagDropdownOpen={tagDropdownOpen} selectedTag={selectedTag} uniqueTags={uniqueTags} setTagDropdownOpen={setTagDropdownOpen} setSelectedTag={setSelectedTag} />
                            </div>
                        </div>
                        <div className="w-full">
                            <DashboardRecentSalesCard
                                salesData={filteredSalesData}
                                currency={currency}
                            />
                        </div>
                    </div>
                ) : (
                    <ConnectAccountButton heading="No account connected" animationType="hover-box" subtitle="Go to your profile to connect your eBay account" buttonText="Go to profile" />
                )}
            </LayoutSubscriptionWrapper>
        </div>
    );
};

export default DashboardPage;
