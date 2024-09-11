"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { database, ref, get } from "@/app/api/auth-firebase/firebaseConfig";  // Assuming Firebase is used for currency preference storage

interface ServerPlansCardPriceStatProps {
  price: number;
  onPlanSelect: (index: number) => void;
  selectedPlan: number | null;
  currencySymbol: string;
}

// Currency conversion rates
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

const ServerPlansCardPriceStat: React.FC<ServerPlansCardPriceStatProps> = ({
  price,
  onPlanSelect,
  selectedPlan,
  currencySymbol
}) => {
  const { data: session } = useSession();
  const [userCurrency, setUserCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');
  const [convertedPrice, setConvertedPrice] = useState(price);

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (session && session.user) {
        const userRef = ref(database, `users/${session.user.customerId}`);
        try {
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const userCurrency = (userData?.currency || 'GBP') as keyof typeof currencySymbols;
          setUserCurrency(userCurrency);
        } catch (error) {
          console.error('Error loading user currency from Firebase:', error);
        }
      }
    };

    if (session && session.user && session.user.customerId) {
      loadUserCurrency();
    }
  }, [session]);

  // Convert the price whenever the userCurrency changes
  useEffect(() => {
    setConvertedPrice(Number((price * currencyConversionRates[userCurrency]).toFixed(2)));
  }, [userCurrency, price]);

  return (
    <div className="stats stats-vertical bg-white sm:stats-horizontal shadow w-full md:w-auto lg:w-full mt-2 mb-2">
      <div
        className={`stat flex flex-col items-center justify-center hover:cursor-pointer hover:bg-lightGreyHighlight hover:bg-opacity-50 transition-colors duration-200 ${
          selectedPlan === 0
            ? "bg-lightGreyHighlight bg-opacity-50"
            : "bg-lightGreyHighlight bg-opacity-0"
        }`}
        onClick={() => onPlanSelect(0)}
      >
        <div className="stat-title text-lightModeText lg:text-sm">Starting From...</div>
        <div className="stat-value text-lightModeText text-2xl sm:text-2xl md:text-3xl lg:text-2xl">
          {currencySymbols[userCurrency]} {/* Use dynamic currency symbol */}
          {convertedPrice.toFixed(2)} {/* Show converted price */}
          <span className="text-sm text-houseBlue"> /month</span>
        </div>
      </div>
    </div>
  );
};

export default ServerPlansCardPriceStat;
