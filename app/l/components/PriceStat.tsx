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
    <div className="stats stats-vertical xl:stats-horizontal lg:stats-horizontal md:stats-vertical shadow md:w-auto lg:w-full flex justify-equally">
      <div
        className={`stat flex flex-col items-center justify-center hover:cursor-pointer hover:bg-lightGreyHighlight hover:bg-opacity-50 transition-colors duration-200 ${
          selectedPlan === 0 ? 'bg-lightGreyHighlight bg-opacity-50' : 'bg-lightGreyHighlight bg-opacity-0'
        }`}
        onClick={() => onPlanSelect(0)}
      >
        <div className="stat-title lg:text-sm">Monthly Plan</div>
        <div className="stat-value text-2xl sm:text-2xl md:text-3xl lg:text-2xl">
          {currencySymbol}{prices[0].toFixed(2)}
        </div>
        <div className="stat-desc">
          <del>{currencySymbol}{(prices[0] * 1.28).toFixed(2)}</del> (Early Access Discount)
        </div>
      </div>

      <div
        className={`stat flex flex-col items-center justify-center hover:cursor-pointer hover:bg-lightGreyHighlight hover:bg-opacity-50 transition-colors duration-200 ${
          selectedPlan === 1 ? 'bg-lightGreyHighlight bg-opacity-50' : 'bg-lightGreyHighlight bg-opacity-0'
        }`}
        onClick={() => onPlanSelect(1)}
      >
        <div className="stat-title lg:text-sm">Yearly Plan</div>
        <div className="stat-value text-paymentPlanText text-2xl sm:text-2xl md:text-3xl lg:text-2xl">
        {currencySymbol}{(prices[0] * 10).toFixed(2)}
        </div>
        <div className="stat-desc text-paymentPlanText">
          Get 2 months free
        </div>
      </div>
    </div>
  );
};

export default PriceStat;
