"use client";

import { Lato, Inter } from "next/font/google";
import ServerPlansCard from "./ServerPlansCard";
import ServerPlansCardWhatsIncluded from "./ServerPlansCardWhatsIncluded";
import React, { useState } from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ServerPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);

  // Function to handle toggle switch change
  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set selectedPlan based on whether the toggle is checked
    setSelectedPlan(event.target.checked ? 1 : 0);
  };

  return (
    <div className="w-full h-full mb-2">
      <div className="flex flex-col items-center space-y-5 text-center mt-10">
        <div className="flex flex-wrap justify-center">
          <p
            className={`${lato.className} text-4xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-houseBlue to-houseHoverBlue bg-clip-text text-transparent py-1`}
          >
            Server Integration
            <a
              className={`${inter.className} mb-8 text-lightModeText text-4xl sm:text-5xl font-bold`}
            >
              {/* This is the space between pricing and made easy */} Made Easy
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
            Looking to integrate a bot into your server? <br />Discover powerful features designed to elevate your Discord community&apos;s interaction.
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={selectedPlan === 1}
              onChange={handleToggleChange}
            />
            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">Monthly</span>
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">Yearly</span>
          </label>
        </div>
      </div>
      <div className="mt-10 grid grid-rows-3 md:grid-rows-none md:grid-cols-3 2xl:px-[100px] mb-8 gap-5">
        <ServerPlansCard
          title="Deal Watch UK"
          description="Effortlessly discover profitable reselling opportunities with our advanced webscraper, which scans hotukdeals.co.uk and compares prices with sold items on eBay to maximize your profits."
          prices={[69.99, 699.90]}
          priceIds={{
            monthly: "price_1PfJ9bJJRepiHZ8dk689bT3H",
            yearly: "price_1PfJ9bJJRepiHZ8dTK0EGZ8k",
          }}
          whatsIncludedComponent={<ServerPlansCardWhatsIncluded specialPlan={true} whatsIncludedText={["Advanced eBay Price Comparison", "Real-time HotUKDeals Scanning", "Instant Alerts for High-Profit Opportunities", "UK-Focused Deal Tracking", "Frequent Updates on Trending Electronics Deals"]}/>}
          specialPlan={true}
          requiredSubscription="deal watch"
          priceRange={selectedPlan}
        />
        <ServerPlansCard
          title="Retiring Sets Deals"
          description="Enhance your reselling efficiency with our cutting-edge bot, scanning diverse websites to identify Lego sets nearing retirement and ensuring you never miss a profitable sale."
          prices={[119.99, 1199.90]}
          priceIds={{
            monthly: "price_1PfJ7pJJRepiHZ8d7gs78YEp",
            yearly: "price_1PfJ7pJJRepiHZ8dAkwkWqHy",
          }}
          whatsIncludedComponent={<ServerPlansCardWhatsIncluded whatsIncludedText={["Comprehensive eBay Price Analysis", "Integrated Keepa Price History Links", "Accurate Retirement Date Notifications", "UK-Centric Retailer Monitoring", "Continuous Expansion of Supported Websites"]}/>}
          requiredSubscription="retiring sets"
          priceRange={selectedPlan}
        />
        <ServerPlansCard
            title="Electronics"
            description="unavailable"
            prices={[169.99, 1699.90]}
            priceIds={{
              monthly: "price_1PfJ9bJJRepiHZ8dk689bT3H",
              yearly: "price_1PfJ9bJJRepiHZ8dTK0EGZ8k",
            }}
            whatsIncludedComponent={<ServerPlansCardWhatsIncluded whatsIncludedText={["Automated eBay Price Comparison", "Monitoring Across Thousands of Products", "High-Precision Profit Potential Alerts", "Dedicated UK Marketplace Focus", "Regular Alerts on Electronics Deals"]}/>}
            requiredSubscription="electronics"
            priceRange={selectedPlan}
          />
      </div>
    </div>
  );
}

export default ServerPlansPage;
