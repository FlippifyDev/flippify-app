"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";

import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import DashboardRecentSalesCard from "./DashboardRecentSalesCard";
import DashboardNoSubscription from "./DashboardNoSubscription";
import ProfitsGraphDateFilter from "./ProfitsGraphDateFilter";
import LayoutLoadingSkeleton from "../../layout/LayoutLoadingSkeleton";
import ProfitsGraphTagFilter from "./ProfitsGraphTagFilter";
import DashboardOverviewCard from "./DashboardOverviewCard";
import DashboardProfitsGraph from "./DashboardProfitsGraph";
import DashboardShowcase from "./DashboardShowcase";
import { useSalesData } from "@/hooks/useSalesData";
import OnboardingFlow from "./OnboardingFlow";


const DashboardPage: React.FC = () => {
	const { data: session } = useSession();
    console.log(session)
	const customerId = session?.user.stripeCustomerId as string;
	const ebayAccessToken = session?.user.connectedAccounts.ebay?.ebayAccessToken as string;
	const currency = session?.user.preferences.locale as string;
	const { salesData, loading, error } = useSalesData(ebayAccessToken, customerId);
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
	).filter((tag) => tag);


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

	return (
		<div className="relative flex flex-col w-full h-full">
			{/* If They Do NOT Have Access */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
				<div className="h-full">
					<OnboardingFlow />
				</div>
			</LayoutSubscriptionWrapper>

			{/* If They Have Access but NO Subscription*/}
			<LayoutSubscriptionWrapper
				requiredSubscriptions={["accessGranted", "!standard"]}
			>
				<div className="w-full h-full overflow-y-auto">
					<div className="flex flex-col lg:flex-row py-2 px-2 bg-white rounded-lg overflow-hidden w-full">
						<div className="lg:w-1/3">
							<DashboardNoSubscription username={session.user.username ?? ""} />
						</div>
						<div className="lg:w-2/3">
							<DashboardShowcase />
						</div>
					</div>
				</div>
			</LayoutSubscriptionWrapper>

			{/* If They Have Subscription */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin", "standard"]}>
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
			</LayoutSubscriptionWrapper>
		</div>
	);
};

export default DashboardPage;
