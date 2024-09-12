import React, { useState, useEffect } from "react";
import PlansGetAccessButton from "./PlansGetAccessButton";
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface PlansCardProps {
  title: string;
  description: string; 
  prices: number[];
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  specialPlan?: boolean;
  priceRange: number;
  className?: string;
  currency: 'GBP' | 'USD' | 'EUR'; 
}

const currencyConversionRates: Record<'GBP' | 'USD' | 'EUR', number> = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

const currencySymbols: Record<'GBP' | 'USD' | 'EUR', string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

const PlansCard: React.FC<PlansCardProps> = ({
  title,
  description,
  prices,
  priceIds,
  whatsIncludedComponent,
  specialPlan,
  priceRange,
  className,
  currency, 
}) => {
  const [currencySymbol, setCurrencySymbol] = useState('£');

  useEffect(() => {
    setCurrencySymbol(currencySymbols[currency]);
  }, [currency]);

  const convertedPrices = prices.map(price =>
    Number((price * currencyConversionRates[currency]).toFixed(2))
  );

  const selectedPriceId = priceRange === 0 ? priceIds.monthly : priceIds.yearly;

  return (
    <div className={`w-full flex justify-center transition duration-200 ${className || ""}`}>
      <div className="w-full sm:w-full min-h-[700px] flex flex-col justify-between relative">
        {specialPlan ? (
          <BackgroundGradient>
            <div className="bg-white rounded-2xl h-full p-6 flex flex-col justify-between min-h-[700px] ">
              {/* Badge for "Most Popular" */}
              <div className="absolute top-[-10px] left-6 z-20 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
                Most Popular
              </div>

              {/* Title and Description */}
              <div className="text-center">
                <h2 className="font-bold text-[24px]">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              {/* Price Section */}
              <div className="flex flex-row items-center mt-5 justify-center">
                <h3 className="font-extrabold text-[40px] text-gray-900">
                  {`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
                </h3>
                <span className="ml-1 mt-4 text-lg text-black font-semibold">
                  /{priceRange === 0 ? 'mo' : 'yr'}
                </span>
              </div>

              {/* Features */}
              <section className="flex-grow mt-5">
                {whatsIncludedComponent}
              </section>

              {/* Button */}
              <section className="mt-auto">
                {prices.length > 0 && (
                  <div className="flex">
                    <PlansGetAccessButton
                      redirect="dashboard"
                      specialPlan={specialPlan}
                    />
                  </div>
                )}
              </section>
            </div>
          </BackgroundGradient>
        ) : (
          <div className="bg-white border rounded-2xl hover:shadow-md transition duration-200 h-full p-6 flex flex-col justify-between min-h-[700px]">
            {/* Title and Description */}
            <div className="text-center">
              <h2 className="font-bold text-[24px]">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>

            {/* Price Section */}
            <div className="flex flex-row items-center mt-5 justify-center">
              <h3 className="font-extrabold text-[40px] text-gray-900">
                {`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
              </h3>
              <span className="ml-1 mt-4 text-lg text-black font-semibold">
                /{priceRange === 0 ? 'mo' : 'yr'}
              </span>
            </div>

            {/* Features */}
            <section className="flex-grow mt-5">
              {whatsIncludedComponent}
            </section>

            {/* Button */}
            <section className="mt-auto">
              {prices.length > 0 && (
                <div className="flex">
                  <PlansGetAccessButton redirect="dashboard" />
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansCard;
