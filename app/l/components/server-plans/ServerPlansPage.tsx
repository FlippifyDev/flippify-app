"use client";

import React, { useState, useEffect } from "react";
import { Lato, Inter } from "next/font/google";
import ServerPlansCard from "./ServerPlansCard";
import ServerPlansCardDealWatchWhatsIncluded from "./ServerPlansCardDealWatchWhatsIncluded";
import ServerPlansCardRetiringSetsWhatsIncluded from "./ServerPlansCardRetiringSetsWhatsIncluded";
import ServerPlansCardElectronicsWhatsIncluded from "./ServerPlansCardElectronicsWhatsIncluded";
import ServerPlansCardRestockInfoWhatsIncluded from "./ServerPlansCardRestockInfoWhatsIncluded";
import { fetchConversionRatesFromFirebase  } from "@/app/api/conversion/currencyApi"; 

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ServerPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR' | 'AUD' | 'CAD'>('GBP');
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({});

  // Fetch conversion rates
  useEffect(() => {
    const fetchRates = async () => {
      const rates = await fetchConversionRatesFromFirebase ();
      setConversionRates(rates || {});
    };
    fetchRates();
  }, []);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.checked ? 1 : 0);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value as 'GBP' | 'USD' | 'EUR' | 'AUD' | 'CAD');
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center mb-2 relative">
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
            Utilize our bots to elevate your Discord community&apos;s value.
          </p>
        </div>
      </div>

      {/* Monthly/Yearly Toggle */}
      <div className="flex justify-center w-full items-center space-x-4 mb-6 mt-6">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value=""
            className="sr-only peer"
            checked={selectedPlan === 1}
            onChange={handleToggleChange}
          />
          <span className="mr-3 text-sm font-medium text-gray-300 select-none">
            Monthly
          </span>
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-300 select-none">
            Yearly
          </span>
        </label>
      </div>

      {/* Server Plans */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 w-full max-w-screen-xl mx-auto px-4">
        <ServerPlansCard
          title="Deal Watch UK"
          description="Discover Endless profitable deals scraped and filtered from site like 'hotukdeals' & 'rewarddeals'"
          prices={{ monthly: 69.99, yearly: 699.99 }}
          whatsIncludedComponent={<ServerPlansCardDealWatchWhatsIncluded />}
          specialPlan={true}
          priceRange={selectedPlan}
          currency={currency}
          conversionRates={conversionRates}
        />
        <ServerPlansCard
          title="Retiring Sets Deals"
          description="Scanning all corners of the internet for deals on soon-to-retire LEGO sets meaning large profits long-term."
          prices={{ monthly: 119.99, yearly: 1199.99 }}
          whatsIncludedComponent={<ServerPlansCardRetiringSetsWhatsIncluded />}
          specialPlan={false}
          priceRange={selectedPlan}
          currency={currency}
          conversionRates={conversionRates}
        />
        <ServerPlansCard
          title="Retock Info"
          description="Keep your community updated with instant restock alerts, helping them grab hot products and boost profits."
          prices={{ monthly: 149.99, yearly: 1499.99 }}
          whatsIncludedComponent={<ServerPlansCardRestockInfoWhatsIncluded />}
          specialPlan={false}
          priceRange={selectedPlan}
          currency={currency}
          unavailable={true}
          conversionRates={conversionRates}
        />
        <ServerPlansCard
          title="Electronics"
          description="Coming Soon - Searching for profitable deals on the best-selling electronics on the market."
          prices={{ monthly: 169.99, yearly: 1699.99 }}
          whatsIncludedComponent={<ServerPlansCardElectronicsWhatsIncluded />}
          specialPlan={false}
          priceRange={selectedPlan}
          currency={currency}
          unavailable={true}
          conversionRates={conversionRates}
        />
      </div>

      {/* Currency Selector */}
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
          <option className="font-semibold text-gray-500" value="AUD">AUD</option>
          <option className="font-semibold text-gray-500" value="CAD">CAD</option>
        </select>
      </div>
    </div>
  );
};

export default ServerPlansPage;
