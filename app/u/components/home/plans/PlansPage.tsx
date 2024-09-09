"use client";

import PlansCard from "./PlansCard";
import PlansCardStandardWhatsIncluded from "./PlansCardProWhatsIncluded";
import PlansCardPremiumWhatsIncluded from "./PlansCardEliteWhatsIncluded";
import PlansCardBasicWhatsIncluded from "./PlansCardStandardWhatsIncluded";
import React, { useState } from "react";

import { Lato, Inter } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.checked ? 1 : 0);
  };

  return (
    <div className="w-full h-full mb-2">
      <div className="flex flex-col items-center space-y-5 text-center mt-6">
        <div className="flex flex-wrap justify-center">
          <p
            className={`${lato.className} text-4xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-houseBlue to-houseHoverBlue bg-clip-text text-transparent py-1`}
          >
            Pricing
            <a
              className={`${inter.className} text-lightModeText text-4xl sm:text-5xl font-bold`}
            >
              {/* This is the space between pricing and made easy */} Made Easy
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 mt-[-12px] mb-2 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
            Flexible Plans for Every Reseller: From Beginners to Experts
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
            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Monthly
            </span>
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Yearly
            </span>
          </label>
        </div>
      </div>

      {/* Subscription Cards with equal heights */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 mx-16 gap-8 items-stretch">
        <PlansCard
          title="Standard"
          description="For beginners"
          prices={[19.99, 199.99]}
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardBasicWhatsIncluded />}
          priceRange={selectedPlan}
        />
        <PlansCard
          title="Pro"
          description="For growing resellers"
          prices={[49.99, 499.99]}
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardStandardWhatsIncluded specialPlan={true} />}
          specialPlan={true}
          priceRange={selectedPlan}
          className="min-h-[650px]"  // Ensure consistent height with others
        />
        <PlansCard
          title="Elite"
          description="For experts"
          prices={[79.99, 799.99]}
          priceIds={{
            monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
            yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
          }}
          whatsIncludedComponent={<PlansCardPremiumWhatsIncluded />}
          priceRange={selectedPlan}
        />
      </div>
    </div>
  );
};

export default PlansPage;
