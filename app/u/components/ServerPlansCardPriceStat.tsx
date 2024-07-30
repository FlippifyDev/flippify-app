"use client";

import React from 'react';

interface PlansCardPriceStatProps {
  price: number;
  onPlanSelect: (index: number) => void;
  selectedPlan: number | null;
  currencySymbol: string;
}

const ServerPlansCardPriceStat: React.FC<PlansCardPriceStatProps> = ({ price, onPlanSelect, selectedPlan, currencySymbol }) => {
  return (
    <div className="stats stats-vertical bg-white sm:stats-horizontal shadow w-full md:w-auto lg:w-full mt-2 mb-2">
      <div
        className={`stat flex flex-col items-center justify-center hover:cursor-pointer hover:bg-lightGreyHighlight hover:bg-opacity-50 transition-colors duration-200 ${
          selectedPlan === 0
            ? "bg-lightGreyHighlight bg-opacity-50"
            : "bg-lightGreyHighlight bg-opacity-0"
        }`}
        onClick={() => onPlanSelect(0)}
      >
        <div className="stat-title text-lightModeText lg:text-sm">Starting From...</div>
        <div className="stat-value text-lightModeText text-2xl sm:text-2xl md:text-3xl lg:text-2xl">
          {currencySymbol}
          {price.toFixed(2)}
          <span className="text-sm text-houseBlue"> /month</span>
        </div>
      </div>
    </div>
  );
};

export default ServerPlansCardPriceStat;
