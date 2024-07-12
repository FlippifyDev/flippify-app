"use client";

import React, { useState } from 'react';
import PriceStat from './PriceStat';
import SubscribeNow from './SubscribeNow';
import { Lato, Inter } from 'next/font/google';
import { IoMdCheckboxOutline } from "react-icons/io";
import { CiShoppingTag } from "react-icons/ci";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

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
    <div className="m-5 sm:scale-90 md:scale-90 lg:max-w-2xl xl:max-w-3xl w-auto px-0 sm:px-32">
      <div className="card lg:card-side bg-base-100 shadow-xl opacity-90 border border-white flex flex-col items-center justify-center mt-20 pt-6 pb-6">
        <div className="w-full px-8 sm:px-6">
          <div className="flex items-center justify-center pb-2">
            <h2 className={`${lato.className} text-3xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center mb-2`}>Early Access Sale</h2>
          </div>
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
          <div className="flex justify-center">
          {prices.length > 0 && (
            <PriceStat
              prices={convertedPrices}
              onPlanSelect={handlePlanSelect}
              selectedPlan={selectedPlan}
              currencySymbol={currencySymbol}
            />
          )}
          </div>
          <div className="flex flex-col items-center justify-center text-white pt-6 pb-6">
            <h2 className="mb-4">What&apos;s included:</h2>
            
            <div className="flex items-center mb-2">
              <IoMdCheckboxOutline className="inline-block mr-2 text-paymentPlanText" /> 
              <p className="mb-0">All Deal-Finding Bots.</p>
            </div>

            <div className="flex items-center">
              <IoMdCheckboxOutline className="inline-block mr-2 text-paymentPlanText" /> 
              <p className="mb-0">All Deal-Finding Bots.</p>
            </div>
          </div>

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
