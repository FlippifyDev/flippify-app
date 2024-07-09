"use client";

import React, { useState } from 'react';
import PriceStat from './PriceStat';
import SubscribeNow from './SubscribeNow';

interface PriceCardProps {
  title: string;
  prices: number[];
  description: string;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, prices, description }) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'GBP'>('USD');

  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };

  const handleCurrencyToggle = () => {
    setCurrency((prevCurrency) => (prevCurrency === 'GBP' ? 'USD' : 'GBP'));
  };

  const convertedPrices = currency === 'GBP' ? prices.map(price => price / 1.28) : prices;
  const currencySymbol = currency === 'GBP' ? '£' : '$';

  return (
    <div className="m-5 sm:scale-90 md:scale-90 lg:max-w-2xl xl:max-w-3xl w-auto">
      <div className="card lg:card-side bg-base-100 shadow-xl opacity-90 border border-white flex flex-col items-center justify-center mt-20 p-6">
        <div className="w-full lg:w-3/4 xl:w-3/4 p-4 lg:p-6">
          <h2 className="card-title text-white text-xl lg:text-2xl font-bold mb-2 flex justify-center">{title}</h2>
          <p className="text-white text-sm lg:text-base mb-4 flex justify-center text-center">{description}</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="label-text text-white">USD</span>
            <input
              type="checkbox"
              className="toggle theme-controller text-white"
              onChange={handleCurrencyToggle}
              checked={currency === 'GBP'}
            />
            <span className="label-text text-white">GBP</span>
          </div>
          {prices.length > 0 && (
            <PriceStat
              prices={convertedPrices}
              onPlanSelect={handlePlanSelect}
              selectedPlan={selectedPlan}
              currencySymbol={currencySymbol}
            />
          )}
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
