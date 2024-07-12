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
  priceIds: { monthly: string; yearly: string };
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  prices,
  description,
  priceIds,
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

  return (
    <div className="sm:scale-90 md:scale-90 lg:max-w-2xl xl:max-w-3xl w-auto px-0 sm:px-32 mt-8 sm:mt-0">
      <div className="card lg:card-side bg-base-100 shadow-xl opacity-90 border border-white flex flex-col items-center justify-center pt-6 pb-6">
        <div className="w-full px-8 sm:px-6">
          <div className="flex items-center justify-center pb-2">
            <h2
              className={`${lato.className} text-3xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center mb-2`}
            >
              Early Access Sale
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
          <div className="flex flex-col items-start text-white pt-6 pb-6 pl-2 sm:text-lg">
            <h2 className="mb-4 font-bold text-lg">What&apos;s included:</h2>
            <div className="grid grid-cols-12 mb-2 items-center">
              <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
              <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                All Deal-Finding Bots
              </p>
            </div>
            <div className="grid grid-cols-12 mb-2 items-center">
              <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
              <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Reselling Course 1.0
              </p>
            </div>
            <div className="grid grid-cols-12 mb-2 items-center">
              <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
              <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Advanced Reselling Tools
              </p>
            </div>
            <div className="grid grid-cols-12 mb-2 items-center">
              <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
              <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Priority Support
              </p>
            </div>
            <div className="grid grid-cols-12 mb-2 items-center">
              <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
              <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Exclusive Reselling Inner Circle
              </p>
            </div>
            <div className="grid grid-cols-12 mb-2 items-center">
              <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
              <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Networking & Self Promotion Access
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            {prices.length > 0 && selectedPlan !== null && (
              <SubscribeNow priceId={selectedPriceId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
