"use client";
import PricingCardPriceStat from "./PricingCardPriceStat";
import PricingCardSubscribeNowButton from "./PricingCardSubscribeNowButton";

import React, { useState } from "react";
import { Lato } from "next/font/google";
const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

interface PricingCardProps {
  title: string;
  prices: number[];
  description: string;
  whatsIncludedComponent: any;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  prices,
  description,
  whatsIncludedComponent,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };


  return (
    <div className="w-86 sm:w-96 sm:mx-4 mt-8 mx-3">
      <div className="h-full card bg-base-100 shadow-xl opacity-90 border border-white flex flex-col items-center justify-center pt-6 pb-6">
        <div className="w-full px-8 sm:px-6">
          <div className="flex items-center justify-center pb-2">
            <h2
              className={`${lato.className} text-3xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center mb-2`}
            >
              {title}
            </h2>
          </div>
          <p className="text-white text-sm lg:text-base mb-4 flex justify-center text-center">
            {description}
          </p>

          <div className="flex flex-col items-center">
            <hr className="w-full" />
            {prices.length > 0 && (
              <PricingCardPriceStat
                prices={prices}
                onPlanSelect={handlePlanSelect}
                selectedPlan={selectedPlan}
                currencySymbol="£"
              />
            )}
            <hr className="w-full" />
          </div>
          {whatsIncludedComponent}
          <div className="flex justify-end mt-2">
            {prices.length > 0 && selectedPlan !== null && (
              <PricingCardSubscribeNowButton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
