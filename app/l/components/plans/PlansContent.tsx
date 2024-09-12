"use client";

import PlansCard from "./PlansCard";
import PlansCardStandardWhatsIncluded from "./PlansCardProWhatsIncluded";
import PlansCardEliteWhatsIncluded from "./PlansCardEliteWhatsIncluded";
import PlansCardBasicWhatsIncluded from "./PlansCardStandardWhatsIncluded";
import React, { useState } from "react";
import { Lato, Inter } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PlansContent = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.checked ? 1 : 0);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value as 'GBP' | 'USD' | 'EUR');
  };

  return (
    <div className="w-full h-full mb-2 relative">
      <div className="flex flex-col items-center space-y-5 text-center mt-2 md:mt-6">
        <div className="flex flex-wrap justify-center">
          <p
            className={`${lato.className} text-5xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-textGradStart to-textGradEnd bg-clip-text text-transparent py-1`}
          >
            Pricing
            <a
              className={`${inter.className} text-white text-5xl sm:text-5xl font-bold`}
            >
              {" "}Made Easy
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 mt-[-12px] mb-2 sm:mx-2 text-gray-300 text-md sm:text-lg text-center">
            Flexible Plans for Every Reseller: From Beginners to Experts
          </p>
        </div>

        <div className="flex justify-center w-4/5 sm:w-full items-center space-x-4">
          {/* Monthly/Yearly Toggle */}
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
      </div>

      {/* Subscription Cards with equal heights */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 mx-6 lg:px-32 md:mx-2 lg:mx-16 gap-8 items-stretch">
        <PlansCard
          title="Standard"
          description="For beginners"
          prices={[19.99, 199.9]}
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardBasicWhatsIncluded />}
          priceRange={selectedPlan}
          currency={currency}
        />
        <PlansCard
          title="Pro"
          description="For growing resellers"
          prices={[49.99, 499.9]}
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardStandardWhatsIncluded />}
          specialPlan={true}
          priceRange={selectedPlan}
          currency={currency}
        />
        <PlansCard
          title="Elite"
          description="For experts"
          prices={[79.99, 799.9]}
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardEliteWhatsIncluded />}
          priceRange={selectedPlan}
          currency={currency}
        />
      </div>

      {/* Currency Selector at the bottom center */}
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

export default PlansContent;
