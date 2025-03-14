"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineTag } from "react-icons/ai";
import PlansGetAccessButton from "./PlansGetAccessButton";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useSpring, animated } from "react-spring";

interface PlansCardProps {
  title: string;
  description: string;
  prices: { monthly: number; yearly: number };
  discountedPrices: { monthly: number; yearly: number };
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  specialPlan?: boolean;
  priceRange: number;
  className?: string;
  currency: "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";
  conversionRates: Record<string, number>;
  comingSoon?: boolean;
}

const currencySymbols: Record<
  "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD",
  string
> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  AUD: "A$",
  CAD: "C$",
  JPY: "¥",
  NZD: "NZ$",
};

interface PriceDisplayProps {
  value: number;
  currencySymbol: string;
}
const PriceDisplay: React.FC<PriceDisplayProps> = ({ value, currencySymbol }) => {
  const props = useSpring({
    number: value,
    from: { number: 0 },
    config: { tension: 200, friction: 20 },
  });
  return (
    <animated.span className="text-[40px] text-gray-900 font-extrabold">
      {props.number.to((n) => `${currencySymbol}${n.toFixed(2)}`)}
    </animated.span>
  );
};

const PlansCard: React.FC<PlansCardProps> = ({
  title,
  description,
  prices,
  discountedPrices,
  whatsIncludedComponent,
  specialPlan,
  priceRange,
  className,
  currency,
  conversionRates,
  comingSoon = false,
}) => {
  const [currencySymbol, setCurrencySymbol] = useState("£");

  useEffect(() => {
    setCurrencySymbol(currencySymbols[currency]);
  }, [currency]);

  // Fallback rate if conversionRates[currency] is undefined
  const rate = conversionRates[currency] ?? 1;

  const originalPricesConverted = {
    monthly: (prices.monthly * rate).toFixed(2),
    yearly: (prices.yearly * rate).toFixed(2),
  };

  const discountedPricesConverted = {
    monthly: (discountedPrices.monthly * rate).toFixed(2),
    yearly: (discountedPrices.yearly * rate).toFixed(2),
  };

  const displayPrice =
    priceRange === 0
      ? discountedPricesConverted.monthly
      : discountedPricesConverted.yearly;
  const displayOriginalPrice =
    priceRange === 0
      ? originalPricesConverted.monthly
      : originalPricesConverted.yearly;

  // Convert displayPrice to number if possible
  const priceNumber = !isNaN(Number(displayPrice)) ? Number(displayPrice) : null;

  return (
    <div className="col-span-1 flex justify-center w-[380px] mx-auto">
      <div className={`relative w-full rounded-2xl ${comingSoon ? "overflow-hidden" : ""}`}>
        {/* Card Content */}
        <div
          className={`w-full min-h-[700px] flex flex-col justify-between relative ${className || ""}`}
        >
          {specialPlan ? (
            <BackgroundGradient className="z-40">
              <div className="bg-white rounded-2xl h-full p-6 z-50 flex flex-col justify-between min-h-[700px]">
                <div className="absolute top-[-10px] left-6 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
                  Most Popular
                </div>
                <div className="text-center">
                  <h2 className="font-bold text-[24px]">{title}</h2>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div className="flex items-center justify-center text-houseBlue font-semibold text-md mt-4">
                  <AiOutlineTag className="mr-2" />
                  Early Access Discount
                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                  <div className="flex items-baseline">
                    {priceNumber === 0 ? (
                      <span className="font-extrabold text-[40px] text-gray-900">Free</span>
                    ) : priceNumber !== null ? (
                      <PriceDisplay value={priceNumber} currencySymbol={currencySymbol} />
                    ) : (
                      <span className="font-extrabold text-[40px] text-gray-900">Custom Pricing</span>
                    )}
                    <span className="ml-1 text-lg text-black font-semibold">
                      /{priceRange === 0 ? "mo" : "yr"}
                    </span>
                  </div>
                  {Number(displayPrice) !== Number(displayOriginalPrice) && (
                    <span className="text-md text-gray-500 line-through">
                      {`${currencySymbol}${displayOriginalPrice}`}
                    </span>
                  )}
                </div>
                <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
                <section className="mt-auto">
                  <div className="flex">
                    {!comingSoon && (
                      <PlansGetAccessButton redirect="dashboard" specialPlan={specialPlan} />
                    )}
                  </div>
                </section>
              </div>
            </BackgroundGradient>
          ) : (
            <div className="bg-white border rounded-2xl hover:shadow-md transition duration-200 h-full p-6 flex flex-col justify-between min-h-[700px]">
              <div className="text-center">
                <h2 className="font-bold text-[24px]">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
              <div className="flex items-center justify-center text-houseBlue font-semibold text-md mt-4">
                <AiOutlineTag className="mr-2" />
                Early Access Discount
              </div>
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex items-baseline">
                  {priceNumber === 0 ? (
                    <span className="font-extrabold text-[40px] text-gray-900">Free</span>
                  ) : priceNumber !== null ? (
                    <>
                      <PriceDisplay value={priceNumber} currencySymbol={currencySymbol} />
                      <span className="ml-1 text-lg text-black font-semibold">
                        /{priceRange === 0 ? "mo" : "yr"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-extrabold text-[40px] text-gray-900">Custom Pricing</span>
                      <span className="ml-1 text-lg text-black font-semibold">
                        /{priceRange === 0 ? "mo" : "yr"}
                      </span>
                    </>
                  )}
                </div>
                {Number(displayPrice) !== Number(displayOriginalPrice) && (
                  <span className="text-md text-gray-500 line-through">
                    {`${currencySymbol}${displayOriginalPrice}`}
                  </span>
                )}
              </div>
              <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
              <section className="mt-auto">
                <div className="flex">
                  {!comingSoon && <PlansGetAccessButton redirect="dashboard" />}
                </div>
              </section>
            </div>
          )}
        </div>
        {comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none backdrop-blur-sm">
            <div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
              Coming Soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansCard;
