"use client";

import ServerPricingPriceStat from "./ServerPricingPriceStat";
import React, { useState } from "react";
import { Lato } from "next/font/google";
import Link from 'next/link';
const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

type BadgeColor = 'greenLabel' | 'blueLabel' | 'orangeLabel';

const badgeColorClasses: Record<BadgeColor, string> = {
  greenLabel: "bg-greenLabel",
  blueLabel: "bg-houseBlue",
  orangeLabel: "bg-orangeLabel",
};

interface PricingCardProps {
    title: string;
    price: number;
    description: string;
    priceIds: { monthly: string; yearly: string };
    whatsIncludedComponent: any;
    labelText: string;
    badgeColor: BadgeColor;
}

const ServerPricingCard: React.FC<PricingCardProps> = ({
    title,
    price,
    description,
    priceIds,
    whatsIncludedComponent,
    labelText,
    badgeColor,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"USD" | "GBP">("USD");


  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };

  const handleCurrencyToggle = () => {
    setCurrency((prevCurrency) => (prevCurrency === "GBP" ? "USD" : "GBP"));
  };

  const convertedPrice = currency === "GBP" ? price / 1.28 : price;
  const currencySymbol = currency === "GBP" ? "£" : "$";

  const badgeClassName = `text-white ${badgeColorClasses[badgeColor]}`;

  return (
    <div className="w-86 sm:w-96 sm:mx-4 mt-8 mx-3">
      <div className="h-full card bg-base-100 shadow-xl opacity-90 border border-white flex flex-col items-center justify-center pt-6 pb-6">
        <div className="w-full px-8 sm:px-6">
          <div className={`absolute top-1 left-1 ${badgeClassName} border-white border ml-2 mt-1 rounded-full px-4 py-1 text-xs font-semibold`}>
            {labelText}
          </div>
          <div className="flex items-center justify-center pt-4 pb-2">
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
            {price && (
              <ServerPricingPriceStat
                price={convertedPrice}
                onPlanSelect={handlePlanSelect}
                selectedPlan={selectedPlan}
                currencySymbol={currencySymbol}
              />
            )}
            <hr className="w-full" />
          </div>
          {whatsIncludedComponent}
          <div className="flex justify-center mt-2">
            {selectedPlan !== null && (
              <Link
              href="https://discord.com/channels/1236428617962229830/1236436288442466394"
              target="_blank"
              className="btn bg-white text-black rounded-lg mr-1 hover:bg-textGradStart hover:border-white transition-color duration-300 w-2/3"
            >
              Contact Us
            </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerPricingCard;
