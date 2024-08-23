"use client";

import React, { useState, useEffect } from "react";
import { Lato } from "next/font/google";
import ServerPlansCardPriceStat from "./ServerPlansCardPriceStat";
import { useSession } from "next-auth/react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

type BadgeColor = 'greenLabel' | 'blueLabel' | 'orangeLabel';

const badgeColorClasses: Record<BadgeColor, string> = {
  greenLabel: "bg-greenLabel",
  blueLabel: "bg-houseBlue",
  orangeLabel: "bg-orangeLabel",
};

interface PlansCardProps {
  title: string;
  price: number;
  description: string;
  priceIds: { monthly: string; yearly: string };
  whatsIncludedComponent: any;
  labelText: string;
  badgeColor: BadgeColor;
}

const currencyConversionRates = {
  GBP: 1,
  USD: 1.28,
  EUR: 1.16,
};

const ServerPlansCard: React.FC<PlansCardProps> = ({
  title,
  price,
  description,
  priceIds,
  whatsIncludedComponent,
  labelText,
  badgeColor,
}) => {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"GBP" | "USD" | "EUR">("GBP");

  useEffect(() => {
    if (session && session.user && session.user.currency) {
      setCurrency(session.user.currency as 'GBP' | 'USD' | 'EUR');
    }
  }, [session]);

  const handlePlanSelect = (index: number) => {
    setSelectedPlan(index);
  };

  const handleCurrencyToggle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as 'GBP' | 'USD' | 'EUR');
  };

  const convertedPrice = Number((price * currencyConversionRates[currency]).toFixed(2));
  const currencySymbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "€";

  const badgeClassName = `text-white ${badgeColorClasses[badgeColor]}`;

  return (
    <div className="w-88 sm:w-full sm:max-w-sm mx-12 mt-8">
      <div className="card bg-white border border-gray-300 rounded-lg h-full shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
        <div className="relative">
          <div className={`absolute top-1 left-1 ${badgeClassName} rounded-full px-4 py-1 text-xs font-semibold`}>
            {labelText}
          </div>
          <div className="p-6 text-center">
            <h2
              className={`${lato.className} text-3xl text-houseBlue font-bold mb-2 mt-4 sm:h-[3rem]`}
            >
              {title}
            </h2>
            <p className="text-lightModeText text-sm mb-8 sm:h-[5rem]">
              {description}
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2" htmlFor="currency">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={handleCurrencyToggle}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            {price && (
              <ServerPlansCardPriceStat
                price={convertedPrice}
                onPlanSelect={handlePlanSelect}
                selectedPlan={selectedPlan}
                currencySymbol={currencySymbol}
              />
            )}
            {whatsIncludedComponent}
          </div>
          <div className="border-t border-gray-200">
            <div className="flex justify-between p-4">
              {selectedPlan !== null && (
                <div className="flex gap-2 w-full">
                  <a
                    href="https://discord.com/channels/1236428617962229830/1236436288442466394"
                    className="btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto"
                  >
                    Contact Us
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerPlansCard;
