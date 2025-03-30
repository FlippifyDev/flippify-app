"use client";

import PlansCard from "./PlansCard";
import PlansCardStandardWhatsIncluded from "./PlansCardStandardWhatsIncluded";
import PlansCardProWhatsIncluded from "./PlansCardProWhatsIncluded";
import PlansCardFreeWhatsIncluded from "./PlansCardFreeWhatsIncluded";
import PlansCardEnterpriseWhatsIncluded from "./PlansCardEnterpriseWhatsIncluded";
import React, { useState, useEffect, useCallback } from "react";
import { Lato, Inter } from "next/font/google";
import { fetchConversionRates } from "@/utils/currency-api";
import CurrencyDropdown from "./PlansCardCurrencyDropdown";


const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

type Currency = "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";

const PlansContent = () => {
    const [selectedPlan, setSelectedPlan] = useState<number>(0);
    const [currency, setCurrency] = useState<Currency>("USD");
    const [enterpriseListings, setEnterpriseListings] = useState<number>(200);
    const [conversionRates, setConversionRates] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchRates = async () => {
            const rates = await fetchConversionRates();
            setConversionRates(rates);
        };
        fetchRates();
    }, []);

    const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPlan(event.target.checked ? 1 : 0);
    };

    const handleCurrencyChange = useCallback((newCurrency: Currency) => {
        setCurrency(newCurrency);
    }, []);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center mb-12 relative pb-20">
            <div className="flex flex-col items-center space-y-5 text-center mt-2 md:mt-6">
                <div className="flex flex-wrap justify-center animate-fadeInPrimary">
                    <p
                        className={`${lato.className} text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-textGradStart to-textGradEnd bg-clip-text text-transparent py-1`}
                    >
                        Pricing
                        <a className={`${inter.className} text-white text-5xl font-bold`}>
                            {" "}
                            Made Easy
                        </a>
                    </p>
                </div>
                <div className="flex justify-center w-4/5 sm:w-full animate-fadeInSecondary">
                    <p className="mx-4 mt-[-12px] mb-2 sm:mx-2 text-gray-300 text-md sm:text-lg text-center">
                        Flexible Plans for Every eBay Seller: From Beginners to Experts
                    </p>
                </div>
                <div className="flex justify-center w-4/5 sm:w-full items-center space-x-4">
                    {/* Monthly/Yearly Toggle */}
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={selectedPlan === 1}
                            onChange={handleToggleChange}
                        />
                        <span className="mr-3 text-sm font-medium text-gray-300 select-none">
                            Monthly
                        </span>
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-300 select-none">
                            Yearly
                        </span>
                    </label>
                </div>
            </div>

            {/* Subscription Cards Grid */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-10 md:px-[60px] w-full animate-fadeInBounce p-4">
                <PlansCard
                    title="Free"
                    description="For beginners"
                    prices={{ monthly: 0, yearly: 0 }}
                    discountedPrices={{ monthly: 0, yearly: 0 }}
                    priceIds={{
                        monthly: "price_1R6umYJJRepiHZ8duYSajDvz",
                        yearly: "price_1R6umYJJRepiHZ8d7eBwpE78",
                    }}
                    whatsIncludedComponent={<PlansCardFreeWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    specialPlan
                />
                <PlansCard
                    title="Standard"
                    description="For growing sellers"
                    prices={{ monthly: 9.99, yearly: 99.90 }}
                    discountedPrices={{ monthly: 4.99, yearly: 49.90 }}
                    priceIds={{
                        monthly: "price_1R6umXJJRepiHZ8dXNPscGu8",
                        yearly: "price_1R6umXJJRepiHZ8d473LpjVZ",
                    }}
                    whatsIncludedComponent={<PlansCardStandardWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    comingSoon
                />
                <PlansCard
                    title="Pro"
                    description="For experts"
                    prices={{ monthly: 19.99, yearly: 199.90 }}
                    discountedPrices={{ monthly: 9.99, yearly: 99.90 }}
                    priceIds={{
                        monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
                        yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
                    }}
                    whatsIncludedComponent={<PlansCardProWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    comingSoon
                />
                <PlansCard
                    title="Enterprise"
                    description="For Large Scale Operations"
                    prices={{ monthly: 199.99, yearly: 1999.90 }}
                    discountedPrices={{ monthly: 99.99, yearly: 999.90 }}
                    priceIds={{
                        monthly: "price_1PfJ9YJJRepiHZ8d9ejubfba",
                        yearly: "price_1PfJ9YJJRepiHZ8dXJSNvIx6",
                    }}
                    whatsIncludedComponent={<PlansCardEnterpriseWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    isEnterprise={true}
                    enterpriseListings={enterpriseListings}
                    setEnterpriseListings={setEnterpriseListings}
                    enterpriseContactUrl="/contact"
                    comingSoon
                />
            </div>

            {/* Custom Currency Dropdown from Flowbite */}
            <div className="flex justify-center mt-12">
                <CurrencyDropdown value={currency} onChange={handleCurrencyChange} />
            </div>
        </div>
    );
};

export default PlansContent;
