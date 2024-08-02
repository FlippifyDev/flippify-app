"use client";

import React, { useState } from "react";
import { Lato } from "next/font/google";
import ServerPlansCardPriceStat from "./ServerPlansCardPriceStat";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

type BadgeColor = 'greenLabel' | 'blueLabel' | 'orangeLabel';

const badgeColorClasses: Record<BadgeColor, string> = {
  greenLabel: "bg-greenLabel",
  blueLabel: "bg-houseBlue",
  orangeLabel: "bg-orangeLabel",
};

interface PlansCardProps {
  title: string;
  price: number;
  description: string;
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  labelText: string;
  badgeColor: BadgeColor;
}

const ServerPlansCard: React.FC<PlansCardProps> = ({
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

  const badgeClassName = `text-white border border-white ${badgeColorClasses[badgeColor]}`;

  return (
    <div className="w-88 sm:w-full sm:max-w-sm mx-12 mt-8">
      <div className="card bg-base-100 border border-white h-full shadow-xl opacity-90 overflow-hidden hover:shadow-2xl transition duration-300">
        <div className="relative">
          <div className={`absolute top-1 left-1 ${badgeClassName} rounded-full px-4 ml-2 mt-1 py-1 text-xs font-semibold`}>
            {labelText}
          </div>
          <div className="p-6 text-center">
            <h2
              className={`${lato.className} text-3xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 mb-2 mt-4 sm:h-[3rem]`}
            >
              {title}
            </h2>
            <p className="text-white text-sm mb-8 sm:h-[5rem]">
              {description}
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-white text-xs">USD</span>
              <input
                type="checkbox"
                className="toggle toggle-bordered text-white"
                onChange={handleCurrencyToggle}
                checked={currency === "GBP"}
                aria-label="Currency toggle"
              />
              <span className="text-white text-xs">GBP</span>
            </div>
            <hr className="w-full" />
            {price && (
              <ServerPlansCardPriceStat
                price={convertedPrice}
                onPlanSelect={handlePlanSelect}
                selectedPlan={selectedPlan}
                currencySymbol={currencySymbol}
              />
            )}
            <hr className="w-full" />
            {whatsIncludedComponent}
          </div>
          <div className="border-t border-gray-200">
            <div className="flex justify-between p-4">
              {selectedPlan !== null && (
                <div className="flex gap-2 w-full">
                  <a
                    href="https://discord.com/channels/1236428617962229830/1236436288442466394"
                    className="btn border bg-white hover:bg-textGradStart hover:border-white text-black w-2/3 mx-auto transition duration-300"
                  >
                    Contact Us
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerPlansCard;
