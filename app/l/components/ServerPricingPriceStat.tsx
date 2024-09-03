"use client";

import React from "react";

interface PricingCardPriceStatProps {
  price: number;
  onPlanSelect: (index: number) => void;
  selectedPlan: number | null;
  currencySymbol: string;
}

const ServerPricingPriceStat: React.FC<PricingCardPriceStatProps> = ({
  price,
  onPlanSelect,
  selectedPlan,
  currencySymbol,
}) => {
  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow w-full md:w-auto lg:w-full mt-2 mb-2">
      <div
        className={`stat col-span-1 flex flex-col items-center justify-center hover:cursor-pointer hover:bg-lightGreyHighlight focus:bg-lightGreyBackground hover:bg-opacity-30 transition-colors duration-200 ${
          selectedPlan === 0
            ? "bg-lightGreyHighlight bg-opacity-30"
            : "bg-lightGreyHighlight bg-opacity-0"
        }`}
        onClick={() => onPlanSelect(0)}
      >
        <div className="stat-title lg:text-sm">Starting From...</div>
        <div className="stat-value text-paymentPlanText text-2xl sm:text-2xl md:text-3xl lg:text-2xl">
          {currencySymbol}
          {price.toFixed(2)}
          <span className="text-sm text-gray-500"> /month</span>
        </div>
      </div>
    </div>
  );
};

export default ServerPricingPriceStat;
