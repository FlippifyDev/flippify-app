import React, { useState, useEffect } from "react";
import ServerPlansContactUs from "./ServerPlansContactUs"; 
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface ServerPlansCardProps {
  title: string;
  prices: number;
  description: string;
  whatsIncludedComponent: any;
  specialPlan?: boolean;
  priceRange: number;
  planRole: string;
  unavailable?: boolean;
  currency: 'GBP' | 'USD' | 'EUR'; // Matching the currency prop from the other PlansCard
}

const currencyConversionRates: Record<"GBP" | "USD" | "EUR", number> = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

const currencySymbols: Record<"GBP" | "USD" | "EUR", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

const ServerPlansCard: React.FC<ServerPlansCardProps> = ({
  title,
  prices,
  description,
  whatsIncludedComponent,
  specialPlan,
  priceRange,
  unavailable = false,
  currency,
}) => {
  const [currencySymbol, setCurrencySymbol] = useState("£");

  useEffect(() => {
    setCurrencySymbol(currencySymbols[currency]);
  }, [currency]);

  // Convert prices based on the selected currency
  const convertedPrice =
    Number((prices * currencyConversionRates[currency]).toFixed(2))

  return (
    <div className="w-full flex justify-center transition duration-200 relative z-0">
      <div className="w-full sm:w-full min-h-[650px] flex flex-col justify-between relative z-0">
        {specialPlan ? (
          <BackgroundGradient>
            <div className="bg-white rounded-2xl h-full p-6 flex flex-col justify-between min-h-[650px] relative z-0">
              <div className="absolute top-[-10px] left-6 z-10 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
                Most Popular
              </div>

              <div className="text-center">
                <h2 className="font-bold text-[24px]">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              {/* Price Section */}
              <div className="flex flex-col items-center mt-5">
                <span className="text-sm text-gray-400 mb-0">Starting From...</span>
                <div className="flex flex-row items-center">
                  <h3 className="font-extrabold text-[40px] text-gray-900">
                    {`${currencySymbol}${convertedPrice.toFixed(2)}`}
                  </h3>
                  <span className="ml-1 mt-4 text-lg text-black font-semibold">
                    /{priceRange === 0 ? "mo" : "yr"}
                  </span>
                </div>
              </div>

              <section className="flex-grow mt-5">{whatsIncludedComponent}</section>

              <section className="mt-auto">
                <div className="flex flex-col gap-4">
                  <ServerPlansContactUs specialPlan={specialPlan} unavailable={unavailable} />
                </div>
              </section>
            </div>
          </BackgroundGradient>
        ) : (
          <div className="bg-white border rounded-2xl hover:shadow-md transition duration-200 h-full p-6 flex flex-col justify-between min-h-[650px] relative z-0">
            <div className="text-center">
              <h2 className="font-bold text-[24px]">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>

            {/* Price Section */}
            <div className="flex flex-col items-center mt-5">
                <span className="text-sm text-gray-400 mb-0">Starting From...</span>
                <div className="flex flex-row items-center">
                  <h3 className="font-extrabold text-[40px] text-gray-900">
                    {`${currencySymbol}${convertedPrice.toFixed(2)}`}
                  </h3>
                  <span className="ml-1 mt-4 text-lg text-black font-semibold">
                    /{priceRange === 0 ? "mo" : "yr"}
                  </span>
                </div>
              </div>

            <section className="flex-grow mt-5">{whatsIncludedComponent}</section>

            <section className="mt-auto">
              <div className="flex flex-col gap-4">
                <ServerPlansContactUs specialPlan={specialPlan} unavailable={unavailable} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerPlansCard;
