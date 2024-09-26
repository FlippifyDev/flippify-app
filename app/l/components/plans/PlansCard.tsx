import React, { useEffect, useState } from "react";
import { AiOutlineTag } from "react-icons/ai"; // Icon for the discount tag
import PlansGetAccessButton from "./PlansGetAccessButton";
import { BackgroundGradient } from "@/components/ui/background-gradient";

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
  currency: "GBP" | "USD" | "EUR" | "AUD" | "CAD";
  conversionRates: Record<string, number>;
  comingSoon?: boolean;
}

const currencySymbols: Record<"GBP" | "USD" | "EUR" | "AUD" | "CAD", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  AUD: "A$",
  CAD: "C$",
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

  // Apply conversion rates to the prices
  const originalPricesConverted = {
    monthly: (prices.monthly * conversionRates[currency]).toFixed(2),
    yearly: (prices.yearly * conversionRates[currency]).toFixed(2),
  };

  const discountedPricesConverted = {
    monthly: (discountedPrices.monthly * conversionRates[currency]).toFixed(2),
    yearly: (discountedPrices.yearly * conversionRates[currency]).toFixed(2),
  };

  const displayPrice = priceRange === 0 ? discountedPricesConverted.monthly : discountedPricesConverted.yearly;
  const displayOriginalPrice = priceRange === 0 ? originalPricesConverted.monthly : originalPricesConverted.yearly;

  return (
    <div className="relative w-full flex justify-center transition duration-200">
      {/* Card Content */}
      <div className={`w-full sm:w-full min-h-[700px] flex flex-col justify-between relative ${className || ""} ${comingSoon ? "opacity-50" : ""}`}>
        {specialPlan ? (
          <BackgroundGradient className="z-40">
            {/* Badge for "Most Popular" */}
            <div className="bg-white rounded-2xl h-full p-6 z-50 flex flex-col justify-between min-h-[700px]">
              <div className="absolute top-[-10px] left-6 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
                Most Popular
              </div>

              {/* Title and Description */}
              <div className="text-center">
                <h2 className="font-bold text-[24px]">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              {/* Early Access Discount Section */}
              <div className="flex items-center justify-center text-houseBlue font-semibold text-md mt-4">
                <AiOutlineTag className="mr-2" />
                Early Access Discount
              </div>

              {/* Price Section */}
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex items-baseline">
                  <h3 className="font-extrabold text-[40px] text-gray-900">
                    {`${currencySymbol}${displayPrice}`}
                  </h3>
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
              
              {/* Features */}
              <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
              
              {/* Button - Wont show any button if the plan is coming soon */}
              <section className="mt-auto">
                <div className="flex">
                  {!comingSoon && <PlansGetAccessButton redirect="dashboard" specialPlan={specialPlan} />}
                </div>
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

            {/* Early Access Discount Section */}
            <div className="flex items-center justify-center text-houseBlue font-semibold text-md mt-4">
              <AiOutlineTag className="mr-2" />
              Early Access Discount
            </div>

            {/* Price Section */}
            <div className="flex flex-col items-center justify-center mt-4">
              <div className="flex items-baseline">
                <h3 className="font-extrabold text-[40px] text-gray-900">
                  {`${currencySymbol}${displayPrice}`}
                </h3>
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

            {/* Features */}
            <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
            
            {/* Button */}
            <section className="mt-auto">
              <div className="flex">
                {!comingSoon && <PlansGetAccessButton redirect="dashboard" />}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Coming Soon Box */}
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
            Coming Soon
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansCard;