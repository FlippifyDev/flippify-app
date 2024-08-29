"use client";
import PricingCardPriceStat from "./PricingCardPriceStat";
import PricingCardSubscribeNowButton from "./PricingCardSubscribeNowButton";

import React, { useState } from "react";
import { Lato } from "next/font/google";
const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

interface PricingCardProps {
  title: string;
  prices: number[];
  description: string;
  whatsIncludedComponent: any;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  prices,
  description,
  whatsIncludedComponent,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"GBP" | "USD">("GBP"); // Default to GBP

  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };

  const handleCurrencyToggle = () => {
    setCurrency((prevCurrency) => (prevCurrency === "GBP" ? "USD" : "GBP"));
  };

  const convertedPrices =
    currency === "USD" ? prices.map((price) => price * 1.28) : prices;
  const currencySymbol = currency === "GBP" ? "£" : "$";

  return (
    <div className="w-86 sm:w-96 sm:mx-4 mt-8 mx-3">
      <div className="h-full card bg-base-100 shadow-xl opacity-90 border border-white flex flex-col items-center justify-center pt-6 pb-6">
        <div className="w-full px-8 sm:px-6">
          <div className="flex items-center justify-center pb-2">
            <h2
              className={`${lato.className} text-3xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center mb-2`}
            >
              {title}
            </h2>
          </div>
          <p className="text-white text-sm lg:text-base mb-4 flex justify-center text-center">
            {description}
          </p>
          <div
            className="flex items-center justify-center gap-2 mb-4"
            style={{ userSelect: "none" }} // Prevent text selection
          >
            <span className="label-text text-white">GBP</span>
            <input
              type="checkbox"
              className="toggle theme-controller text-white"
              onChange={handleCurrencyToggle}
              checked={currency === "USD"}
              style={{ 
                userSelect: "none", // Prevent text selection on toggle
                outline: "none", // Remove focus outline
                WebkitTapHighlightColor: "transparent", // Remove tap highlight on mobile
              }}
            />
            <span className="label-text text-white">USD</span>
          </div>
          <div className="flex flex-col items-center">
            <hr className="w-full" />
            {prices.length > 0 && (
              <PricingCardPriceStat
                prices={convertedPrices}
                onPlanSelect={handlePlanSelect}
                selectedPlan={selectedPlan}
                currencySymbol={currencySymbol}
              />
            )}
            <hr className="w-full" />
          </div>
          {whatsIncludedComponent}
          <div className="flex justify-end mt-2">
            {prices.length > 0 && selectedPlan !== null && (
              <PricingCardSubscribeNowButton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
