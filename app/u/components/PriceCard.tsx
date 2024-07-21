"use client";

import React, { useState } from "react";
import PriceStat from "./PriceStat";
import SubscribeNow from "./SubscribeNow";
import SubscriptionWrapper from "./SubscriptionWrapper";
import { Lato } from "next/font/google";
import JoinWaitlistButton from "./JoinWaitlistButton";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

type BadgeColor = 'greenLabel' | 'blueLabel' | 'orangeLabel';

const badgeColorClasses: Record<BadgeColor, string> = {
  greenLabel: "bg-greenLabel",
  blueLabel: "bg-houseBlue",
  orangeLabel: "bg-orangeLabel",
  // Add other mappings as needed
};

interface PriceCardProps {
  title: string;
  prices: number[];
  description: string;
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  labelText: string;
  badgeColor: BadgeColor;
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  prices,
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

  const convertedPrices =
    currency === "GBP" ? prices.map((price) => price / 1.28) : prices;
  const currencySymbol = currency === "GBP" ? "£" : "$";

  const selectedPriceId =
    selectedPlan === 0 ? priceIds.monthly : priceIds.yearly;

  const badgeClassName = `badge text-white ${badgeColorClasses[badgeColor]}`;

  return (
    <div className="w-80 sm:w-96 sm:mx-4 mt-8">
      <div className="h-full card bg-white hover:shadow-planCardShadow transition duration-200 opacity-90 border-2 border-gray-500 flex flex-col items-center justify-center pt-6 pb-6 ">
        <div className="w-full px-8 sm:px-6">
          <div className="flex items-center justify-center pb-2">
            <h2
              className={`${lato.className} text-3xl text-houseBlue py-1 text-center mb-2`}
            >
              {title}
            </h2>
          </div>
          <p className="text-lightModeText text-sm lg:text-base mb-4 flex justify-center text-center">
            {description}
          </p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="label-text text-lightModeText">USD</span>
            <input
              type="checkbox"
              className="toggle theme-controller text-white"
              onChange={handleCurrencyToggle}
              checked={currency === "GBP"}
            />
            <span className="label-text text-lightModeText">GBP</span>
          </div>
          <div className="flex flex-col items-center">
            <hr className="w-full bg-gray-800" />
            {prices.length > 0 && (
              <PriceStat
                prices={convertedPrices}
                onPlanSelect={handlePlanSelect}
                selectedPlan={selectedPlan}
                currencySymbol={currencySymbol}
              />
            )}
            <hr className="w-full bg-gray-800" />
          </div>
          {whatsIncludedComponent}
          <div className="grid grid-cols-2 items-end">
            <div className={`${badgeClassName} border-none font-semibold text-xs flex items-center justify-center h-auto min-h-[2rem] text-center`}>
              {labelText}
            </div>
            <div className="flex justify-end mt-2">
              {prices.length > 0 && selectedPlan !== null && (
                <div>
                  <SubscriptionWrapper requiredSubscriptions={["whitelisted"]}>
                    <SubscribeNow priceId={selectedPriceId} />
                  </SubscriptionWrapper>
                  <SubscriptionWrapper requiredSubscriptions={["!whitelisted"]}>
                    <JoinWaitlistButton
                      text="Join Waitlist"
                      redirect="dashboard"
                    />
                  </SubscriptionWrapper>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
