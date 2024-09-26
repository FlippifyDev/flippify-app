import React, { useState, useEffect } from "react";
import ServerPlansContactUs from "./ServerPlansContactUs"; 
import { BackgroundGradient } from "@/components/ui/background-gradient";

interface ServerPlansCardProps {
  title: string;
  prices: { monthly: number; yearly: number };
  description: string;
  whatsIncludedComponent: any;
  specialPlan?: boolean;
  priceRange: number;
  planRole?: string;
  unavailable?: boolean;
  currency: 'GBP' | 'USD' | 'EUR' | 'AUD' | 'CAD';
  conversionRates: Record<string, number>;
}

const currencySymbols: Record<"GBP" | "USD" | "EUR" | "AUD" | "CAD", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  AUD: "A$",
  CAD: "C$",
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
  conversionRates,
}) => {
  const [currencySymbol, setCurrencySymbol] = useState("£");
  const [convertedPrice, setConvertedPrice] = useState(prices.monthly);

  useEffect(() => {
    setCurrencySymbol(currencySymbols[currency]);

    // Update the converted price based on currency
    const newPrice =
      priceRange === 0
        ? prices.monthly * (conversionRates[currency] || 1)
        : prices.yearly * (conversionRates[currency] || 1);
    setConvertedPrice(Number(newPrice.toFixed(2)));
  }, [currency, priceRange, prices, conversionRates]);

  return (
    <div className="w-full flex justify-center transition duration-200 relative">
      <div className="w-full sm:w-full min-h-[650px] flex flex-col justify-between relative ">
        {specialPlan ? (
          <BackgroundGradient className="z-40">
            <div className="bg-white rounded-2xl h-full p-6 flex flex-col justify-between min-h-[650px] relative z-50">
              <div className="absolute top-[-10px] left-6 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
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