"use client";

import React, { useState, useEffect } from "react";
import { Lato, Inter } from "next/font/google";
import ServerPlansCard from "./ServerPlansCard";
import ServerPlansCardDealWatchWhatsIncluded from "./ServerPlansCardDealWatchWhatsIncluded";
import ServerPlansCardRetiringSetsWhatsIncluded from "./ServerPlansCardRetiringSetsWhatsIncluded";
import ServerPlansCardElectronicsWhatsIncluded from "./ServerPlansCardElectronicsWhatsIncluded";
import { useSession } from "next-auth/react";
import { database, ref, get } from "@/app/api/auth-firebase/firebaseConfig";
import { fetchConversionRatesFromFirebase } from "@/app/api/conversion/currencyApi"; // Import from Firebase

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const currencySymbols: Record<"GBP" | "USD" | "EUR", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

const ServerPlansPage = () => {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');
  const [conversionRates, setConversionRates] = useState<Record<string, number>>({
    GBP: 1,
    USD: 1.33,
    EUR: 1.16,
  });
  const [currencySymbol, setCurrencySymbol] = useState("£");

  // Fetch conversion rates from Firebase
  useEffect(() => {
    const fetchRates = async () => {
      const rates = await fetchConversionRatesFromFirebase();
      setConversionRates(rates);
    };
    fetchRates();
  }, []);

  // Fetch user's preferred currency from Firebase
  useEffect(() => {
    const loadUserCurrency = async () => {
      if (session && session.user) {
        const userRef = ref(database, `users/${session.user.customerId}`);
        try {
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const userCurrency = (userData?.currency || "GBP") as keyof typeof currencySymbols;
          setCurrency(userCurrency);
          setCurrencySymbol(currencySymbols[userCurrency]);
        } catch (error) {
          console.error("Error loading user currency from Firebase:", error);
        }
      }
    };

    if (session && session.user && session.user.customerId) {
      loadUserCurrency();
    }
  }, [session]);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlan(event.target.checked ? 1 : 0);
  };

  return (
    <div className="w-full h-full mb-2">
      <div className="flex flex-col items-center space-y-5 text-center mt-10">
        <div className="flex flex-wrap justify-center">
          <p
            className={`${lato.className} text-4xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-houseBlue to-houseHoverBlue bg-clip-text text-transparent py-1`}
          >
            Server Integration
            <a
              className={`${inter.className} mb-8 text-lightModeText text-4xl sm:text-5xl font-bold`}
            >
              Made Easy
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
            Looking to integrate a bot into your server? <br />
            Utilize our bots to elevate your Discord community&apos;s value.
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={selectedPlan === 1}
              onChange={handleToggleChange}
            />
            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
              Monthly
            </span>
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
              Yearly
            </span>
          </label>
        </div>
      </div>

      {/* Server Plans */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 mx-4 md:mx-2 lg:mx-16 gap-8 items-stretch">
        <ServerPlansCard
          title="Deal Watch UK"
          description="Endless profitable deals scraped and filtered from site like 'hotukdeals' & 'rewarddeals'."
          prices={[69.99, 699.90]}
          priceIds={{
            monthly: "price_1PfJ9bJJRepiHZ8dk689bT3H",
            yearly: "price_1PfJ9bJJRepiHZ8dTK0EGZ8k",
          }}
          whatsIncludedComponent={<ServerPlansCardDealWatchWhatsIncluded />}
          specialPlan={true}
          priceRange={selectedPlan}
          planRole="deal watch"
          currency={currency}
          conversionRates={conversionRates}
        />
        <ServerPlansCard
          title="Retiring Sets Deals"
          description="Scanning all corners of the internet for deals on soon-to-retire LEGO sets meaning big profits long-term."
          prices={[119.99, 1199.90]}
          priceIds={{
            monthly: "price_1PfJ7pJJRepiHZ8d7gs78YEp",
            yearly: "price_1PfJ7pJJRepiHZ8dAkwkWqHy",
          }}
          whatsIncludedComponent={<ServerPlansCardRetiringSetsWhatsIncluded />}
          specialPlan={false}
          priceRange={selectedPlan}
          planRole="retiring sets"
          currency={currency}
          conversionRates={conversionRates}
        />
        <ServerPlansCard
          title="Electronics"
          description="Coming Soon - Searching for profitable deals on the best-selling electronics on the market."
          prices={[169.99, 1699.90]}
          priceIds={{
            monthly: "price_1PfJ9bJJRepiHZ8dk689bT3H",
            yearly: "price_1PfJ9bJJRepiHZ8dTK0EGZ8k",
          }}
          whatsIncludedComponent={<ServerPlansCardElectronicsWhatsIncluded />}
          specialPlan={false}
          priceRange={selectedPlan}
          planRole="electronics"
          currency={currency}
          conversionRates={conversionRates}
        />
      </div>
    </div>
  );
};

export default ServerPlansPage;
