"use client";

import React, { useState } from "react";
import { Lato, Inter } from "next/font/google";
import ServerPlansCard from "./ServerPlansCard";
import ServerPlansCardDealWatchWhatsIncluded from "./ServerPlansCardDealWatchWhatsIncluded";
import ServerPlansCardRetiringSetsWhatsIncluded from "./ServerPlansCardRetiringSetsWhatsIncluded";
import ServerPlansCardElectronicsWhatsIncluded from "./ServerPlansCardElectronicsWhatsIncluded";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ServerPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.checked ? 1 : 0);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value as 'GBP' | 'USD' | 'EUR');
  };

  return (
    <div className="w-full h-full mb-2">
      <div className="flex flex-col items-center space-y-5 text-center mt-2 md:mt-6">
        <div className="flex flex-wrap justify-center">
          <p
            className={`${lato.className} text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-textGradStart to-textGradEnd bg-clip-text text-transparent py-1`}
          >
            Server Integration
            <a className={`${inter.className} mb-8 text-white text-5xl font-bold`}>
              {/* This is the blank space don't delete it */} Made Easy
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 mt-[-12px] sm:mx-2 text-gray-300 text-md sm:text-lg text-center">
            Looking to integrate a bot into your server? <br />
            Utilize our bots to elevate your Discord community's value.
          </p>
        </div>
      </div>

      {/* Server Plans */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 mx-6 lg:px-32 md:mx-2 lg:mx-16 gap-8 items-stretch">
        <ServerPlansCard
          title="Retiring Sets Deals"
          description="Scanning all corners of the internet for deals on soon-to-retire LEGO sets meaning big profits long-term."
          prices={119.99}
          whatsIncludedComponent={<ServerPlansCardRetiringSetsWhatsIncluded />}
          specialPlan={false}
          priceRange={selectedPlan}
          planRole="retiring sets"
          currency={currency}
        />
        <ServerPlansCard
          title="Deal Watch UK"
          description="Discover endless profitable deals found by our advanced webscraper searching 'hotukdeals'."
          prices={69.99}
          whatsIncludedComponent={<ServerPlansCardDealWatchWhatsIncluded />}
          specialPlan={true}
          priceRange={selectedPlan}
          planRole="deal watch"
          currency={currency}
        />
        <ServerPlansCard
          title="Electronics"
          description="Coming Soon - Searching for profitable deals on the best-selling electronics on the market."
          prices={169.99}
          whatsIncludedComponent={<ServerPlansCardElectronicsWhatsIncluded />}
          specialPlan={false}
          priceRange={selectedPlan}
          planRole="electronics"
          unavailable={true}
          currency={currency}
        />
      </div>
      <div className="flex justify-center mt-12 mb-[-48px]">
          <select
            id="currency"
            value={currency}
            onChange={handleCurrencyChange}
            className="py-2 px-4 rounded-lg bg-white border-gray-200 text-gray-500 font-semibold text-sm"
          >
            <option className="font-semibold text-gray-500" value="GBP">GBP</option>
            <option className="font-semibold text-gray-500" value="USD">USD</option>
            <option className="font-semibold text-gray-500" value="EUR">EUR</option>
          </select>
      </div>
    </div>
  );
};

export default ServerPlansPage;
