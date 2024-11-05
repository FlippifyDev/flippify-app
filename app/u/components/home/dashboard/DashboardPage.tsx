"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import { useSalesData } from "@/hooks/useSalesData";
import { handleUser } from "@/app/api/auth-firebase/firebaseConfig";
import LayoutLoadingSkeleton from "../../layout/LayoutLoadingSkeleton";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import DashboardRecentSalesCard from "./DashboardRecentSalesCard";
import DashboardNoSubscription from "./DashboardNoSubscription";
import DashboardOverviewCard from "./DashboardOverviewCard";
import DashboardProfitsGraph from "./DashboardProfitsGraph";
import DashboardShowcase from "./DashboardShowcase";
import OnboardingFlow from "./OnboardingFlow";

const DashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<{ uid: string } | null>(null);
  const { data: session } = useSession();
  const customerId = session?.user.customerId as string;
  const { salesData, currency, loading, error } = useSalesData(customerId);
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

  useEffect(() => {
    if (session && session.user && session.user.customerId) {
      const fetchUserData = async () => {
        try {
          const data = await handleUser();
          setUserData(data);
        } catch (error) {
          console.error("Error handling user:", error);
        }
      };
      fetchUserData();
    }
  }, [session]);

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

  if (!session || !session.user || !session.user.customerId || !userData) {
    return <LayoutLoadingSkeleton />;
  }

  // Filter sales data based on the selected tag
  const filteredSalesData = selectedTag
    ? salesData.filter((order) => order.customTag === selectedTag)
    : salesData;

  return (
    <div className="flex flex-col w-full h-full">
      {/* If They Do NOT Have Access */}
      <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
        <div className="h-full">
          <OnboardingFlow />
        </div>
      </LayoutSubscriptionWrapper>

      {/* If They Have Access but NO Subscription */}
      <LayoutSubscriptionWrapper
        requiredSubscriptions={["accessGranted", "!standard"]}
      >
        <div className="flex flex-col lg:flex-row my-4 md:my-11 mx-2 md:mx-6 py-2 md:py-4 md:px-8 bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <div className="lg:w-1/3">
            <DashboardNoSubscription username={session.user.username} />
          </div>
          <div className="lg:w-2/3">
            <DashboardShowcase />
          </div>
        </div>
      </LayoutSubscriptionWrapper>

      {/* If They Have Subscription */}
      <LayoutSubscriptionWrapper requiredSubscriptions={["standard"]}>
        <div className="w-full">
          <DashboardOverviewCard
            salesData={filteredSalesData}
            currency={currency}
            selectedRange={selectedRange}
          />
        </div>
        <div className="w-full mt-2 mb-2">
          <div className="w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6 border">
            <DashboardProfitsGraph
              salesData={filteredSalesData}
              currency={currency}
              selectedRange={selectedRange}
            />
            {/* Dropdown for selecting tags */}
            <div className="flex flex-row w-full gap-4">
              {/* Dropdown for selecting date range */}
              <div className="relative" ref={rangeDropdownRef}>
                <div
                  className="btn m-1 text-lightModeText bg-white hover:bg-gray-100 transition duration-200 rounded-lg w-36"
                  onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
                >
                  {selectedRange === 1
                    ? "Today"
                    : selectedRange === 7
                    ? "This Week"
                    : selectedRange === 30
                    ? "This Month"
                    : selectedRange === 90
                    ? "Last 3 Months"
                    : selectedRange === 180
                    ? "Last 6 Months"
                    : selectedRange === 365
                    ? `${selectedLabel}`
                    : `Last ${selectedRange} days`}{" "}
                </div>
                {rangeDropdownOpen && (
                  <ul
                    className="absolute left-0 bg-white border-gray-100 z-[1] w-52 p-2 shadow transition duration-200 rounded-lg"
                    style={{ marginTop: "-4px" }}
                  >
                    {[
                      { range: 1, label: "Today" },
                      { range: 7, label: "This Week" },
                      { range: 30, label: "This Month" },
                      { range: 90, label: "Last 3 Months" },
                      { range: 180, label: "Last 6 Months" },
                      { range: 365, label: "This Year" },
                      { range: 365, label: "All Time" },
                    ].map(({ range, label }) => (
                      <li key={range}>
                        <a
                          onClick={() => handleRangeChange(range.toString(), label)}
                          className="block px-4 py-2 hover:bg-gray-200 transition duration-100 rounded-lg select-none"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dropdown for selecting custom tag */}
              <div className="relative" ref={tagDropdownRef}>
                <div
                  className="btn m-1 text-lightModeText bg-white hover:bg-gray-100 transition duration-200 rounded-lg w-36"
                  onClick={() => setTagDropdownOpen(!tagDropdownOpen)} // toggle dropdown for tags
                >
                  {selectedTag || "All Tags"}
                </div>
                {tagDropdownOpen && (
                  <ul
                    className="absolute left-0 bg-white border-gray-100 z-[1] w-52 p-2 shadow transition duration-200 rounded-lg"
                    style={{ marginTop: "-4px" }}
                  >
                    <li>
                      <a
                        onClick={() => setSelectedTag(null)} // Handle "All Tags" selection
                        className="block px-4 py-2 hover:bg-gray-200 transition duration-100 rounded-lg select-none"
                      >
                        All Tags
                      </a>
                    </li>
                    {uniqueTags.map((tag, index) => (
                      <li key={index}>
                        <a
                          onClick={() => setSelectedTag(tag)}
                          className="block px-4 py-2 hover:bg-gray-200 transition duration-100 rounded-lg select-none"
                        >
                          {tag}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <DashboardRecentSalesCard
            salesData={filteredSalesData}
            currency={currency}
          />
        </div>
      </LayoutSubscriptionWrapper>
    </div>
  );
};

export default DashboardPage;
