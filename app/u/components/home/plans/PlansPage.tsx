'use client';

import PlansCard from "./PlansCard";
import PlansCardStandardWhatsIncluded from "./PlansCardProWhatsIncluded";
import PlansCardPremiumWhatsIncluded from "./PlansCardEliteWhatsIncluded";
import PlansCardBasicWhatsIncluded from "./PlansCardBasicWhatsIncluded";
import React, { useState } from "react";

import { Lato, Inter } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PlansPage = () => {
  // State to manage selected plan: 0 for Monthly, 1 for Yearly
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
            Pricing
            <a
              className={`${inter.className} mb-8 text-lightModeText text-4xl sm:text-5xl font-bold`}
            >
              {/* This is the space between pricing and made easy */} Made Easy
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
            An all-in-one service meaning you get everything you need with just one plan
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

      {/* Use Flexbox with items-stretch to make all cards the same height */}
      <div className="mt-10 grid grid-rows-3 md:grid-rows-none md:grid-cols-3 2xl:px-[100px] mb-8 gap-5 items-stretch">
        <PlansCard
          title="Standard"
          description="Unlock unlimited access to our comprehensive suite of tools, bots, and insights designed to supercharge your profitability. Our all-in-one subscription provides everything you need to optimize performance and drive growth."
          prices={[19.99, 199.99]} // Monthly and Yearly prices
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardBasicWhatsIncluded />}
          requiredSubscription={"accessGranted"}
          priceRange={selectedPlan}
        />
        <PlansCard
          title="Pro"
          description="unavailable"
          prices={[49.99, 499.99]} // Monthly and Yearly prices
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardStandardWhatsIncluded specialPlan={true} />}
          specialPlan={true}
          requiredSubscription={"accessGranted"}
          priceRange={selectedPlan}
        />
        <PlansCard
          title="Elite"
          description="unavailable"
          prices={[99.99, 999.90]} // Monthly and Yearly prices
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardPremiumWhatsIncluded />}
          requiredSubscription={"accessGranted"}
          priceRange={selectedPlan}
        />
      </div>
    </div>
  );
};

export default PlansPage;
