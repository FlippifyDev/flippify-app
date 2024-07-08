"use client";

import React, { useState } from 'react';
import PriceStat from './PriceStat';
import SubscribeNow from './SubscribeNow';
import Image from 'next/image';

interface PriceCardProps {
  title: string;
  prices: number[];
  priceIds: string[];
  description: string;
  image: string;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, prices, priceIds, description, image }) => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };

  return (
    <div className="m-5 sm:scale-90 md:scale-90 lg:max-w-5xl xl:max-w-6xl w-auto">
      <div className="card lg:card-side bg-base-100 shadow-xl opacity-90 border border-white sm:flex sm:justify-center sm:flex-col">
        {/* Image Section */}
        <div className="lg:flex lg:flex-row lg:items-center">
          <div className="p-2">
            <Image
              src={image}
              alt="Product Image"
              width={400}
              height={400}
              className="object-cover rounded-lg"
              loading="lazy"
            />
          </div>

          {/* Price and Description Section */}
          <div className="w-full lg:w-3/4 xl:w-3/4 p-4 lg:p-6">
            <h2 className="card-title text-white text-xl lg:text-2xl font-bold mb-2">{title}</h2>
            <p className="text-white text-sm lg:text-base mb-4">{description}</p>
            {prices.length > 0 && (
              <PriceStat prices={prices} onPlanSelect={handlePlanSelect} selectedPlan={selectedPlan} />
            )}
            <div className="flex justify-end mt-2">
              {prices.length > 0 && selectedPlan !== null && (
                <SubscribeNow priceId={priceIds[selectedPlan]} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
