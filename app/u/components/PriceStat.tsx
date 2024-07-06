import React, { useState } from 'react';

interface PriceStatProps {
  prices: number[];
  onPlanSelect: (index: number) => void;
  selectedPlan: number | null;
}

const PriceStat: React.FC<PriceStatProps> = ({ prices, onPlanSelect, selectedPlan }) => {
  return (
    <div className="stats stats-vertical xl:stats-horizontal lg:stats-horizontal md:stats-vertical shadow md:w-auto lg:w-full">
      <div
        className={`stat hover:cursor-pointer hover:bg-gray-100 ${selectedPlan === 0 ? 'bg-gray-200' : ''}`}
        onClick={() => onPlanSelect(0)}
      >
        <div className="stat-title lg:text-sm">Monthly Plan</div>
        <div className="stat-value text-2xl sm:text-2xl md:text-3xl lg:text-2xl">£{prices[0]}</div>
        <div className="stat-desc">Yearly Fee £{prices[0] * 12}</div>
      </div>

      <div
        className={`stat hover:cursor-pointer hover:bg-gray-100 ${selectedPlan === 1 ? 'bg-gray-200' : ''}`}
        onClick={() => onPlanSelect(1)}
      >
        <div className="stat-title lg:text-sm">3 Month Plan</div>
        <div className="stat-value text-2xl sm:text-2xl md:text-3xl lg:text-2xl">£{prices[1]}</div>
        <div className="stat-desc">Yearly Fee £{prices[1] * 12}</div>
      </div>

      <div
        className={`stat hover:cursor-pointer hover:bg-gray-100 ${selectedPlan === 2 ? 'bg-gray-200' : ''}`}
        onClick={() => onPlanSelect(2)}
      >
        <div className="stat-title lg:text-sm">Yearly Plan</div>
        <div className="stat-value text-paymentPlanText text-2xl sm:text-2xl md:text-3xl lg:text-2xl">£{prices[2]}</div>
        <div className="stat-desc text-paymentPlanText">Yearly Fee £{prices[2] * 12}</div>
      </div>
    </div>
  );
};

export default PriceStat;
