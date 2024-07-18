"use client";

import React from 'react';

interface PriceStatProps {
  prices: number[];
  onPlanSelect: (index: number) => void;
  selectedPlan: number | null;
  currencySymbol: string;
}

const PriceStat: React.FC<PriceStatProps> = ({ prices, onPlanSelect, selectedPlan, currencySymbol }) => {
  return (
    <div className="stats stats-vertical bg-white sm:grid sm:grid-cols-2 sm:stats-horizontal shadow w-full md:w-auto lg:w-full mt-2 mb-2">
      <div
        className={`stat col-span-1 flex flex-col items-center justify-center hover:cursor-pointer hover:bg-lightGreyHighlight hover:bg-opacity-50 transition-colors duration-200 ${
          selectedPlan === 0
            ? "bg-lightGreyHighlight bg-opacity-50"
            : "bg-lightGreyHighlight bg-opacity-0"
        }`}
        onClick={() => onPlanSelect(0)}
      >
        <div className="stat-title text-lightModeText lg:text-sm">Monthly Plan</div>
        <div className="stat-value text-lightModeText text-2xl sm:text-2xl md:text-3xl lg:text-2xl">
          {currencySymbol}
          {prices[0].toFixed(2)}
        </div>
        <div className="stat-desc text-lightModeText text-center">
          <del>
            {currencySymbol}
            {(prices[1]).toFixed(2)}
          </del>
        </div>
      </div>

      <div
        className={`stat col-span-1 flex flex-col items-center justify-center hover:cursor-pointer hover:bg-lightGreyHighlight hover:bg-opacity-50 transition-colors duration-200 ${
          selectedPlan === 1
            ? "bg-lightGreyHighlight bg-opacity-50"
            : "bg-lightGreyHighlight bg-opacity-0"
        }`}
        onClick={() => onPlanSelect(1)}
      >
        <div className="stat-title text-lightModeText lg:text-sm">Yearly Plan</div>
        <div className="stat-value text-houseBlue text-2xl sm:text-2xl md:text-3xl lg:text-2xl">
          {currencySymbol}
          {(prices[0] * 10).toFixed(2)}
        </div>
        <div className="stat-desc text-houseBlue">Get 2 months free</div>
      </div>
    </div>
  );
};

export default PriceStat;
