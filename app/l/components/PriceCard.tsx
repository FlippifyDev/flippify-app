"use client";




import React, { useState } from "react";
import PriceStat from "./PriceStat";
import SubscribeNow from "./SubscribeNow";
import { IoMdCheckboxOutline } from "react-icons/io";
import { Lato, Inter } from "next/font/google";
const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

interface PriceCardProps {
  title: string;
  prices: number[];
  description: string;
  whatsIncludedComponent: any
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  prices,
  description,
  whatsIncludedComponent
}) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"USD" | "GBP">("USD");


  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };

  const handleCurrencyToggle = () => {
    setCurrency((prevCurrency) => (prevCurrency === "GBP" ? "USD" : "GBP"));
  };

  const convertedPrices =
    currency === "GBP" ? prices.map((price) => price / 1.28) : prices;
  const currencySymbol = currency === "GBP" ? "£" : "$";

  return (
    <div className="max-w-md sm:mx-4 mt-8 mx-1">
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="label-text text-white">USD</span>
            <input
              type="checkbox"
              className="toggle theme-controller text-white"
              onChange={handleCurrencyToggle}
              checked={currency === "GBP"}
            />
            <span className="label-text text-white">GBP</span>
          </div>
          <div className="flex flex-col items-center">
            <hr className="w-full" />
            {prices.length > 0 && (
              <PriceStat
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
              <SubscribeNow />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
