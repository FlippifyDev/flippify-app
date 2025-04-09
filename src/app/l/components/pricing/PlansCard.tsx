"use client";

import React, { useEffect, useState } from "react";
import { AiOutlineTag } from "react-icons/ai";
import PlansGetAccessButton from "./PlansGetAccessButton";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useSpring, animated } from "react-spring";
import { discordSupportLink } from "@/utils/constants";

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
    // Extra props for Enterprise plan:
    isEnterprise?: boolean;
    enterpriseListings?: number;
    setEnterpriseListings?: (value: number) => void;
    enterpriseContactUrl?: string;
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

const calculateEnterprisePrice = (value: number): number => {
    const base = 99.99;
    const maxPrice = 199.99;
    const multiplier = (maxPrice - base) / (1500 - 200);
    return base + (value - 200) * multiplier;
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
    isEnterprise = false,
    enterpriseListings,
    setEnterpriseListings,
    enterpriseContactUrl,
}) => {
    const [currencySymbol, setCurrencySymbol] = useState("$");

    useEffect(() => {
        setCurrencySymbol(currencySymbols[currency]);
    }, [currency]);

    // Fallback rate if conversionRates[currency] is undefined
    const rate = conversionRates[currency] ?? 1;

    // For non-enterprise plans, use original calculations:
    const originalPricesConverted = {
        monthly: (prices.monthly * rate).toFixed(2),
        yearly: (prices.yearly * rate).toFixed(2),
    };

    const discountedPricesConverted = {
        monthly: (discountedPrices.monthly * rate).toFixed(2),
        yearly: (discountedPrices.yearly * rate).toFixed(2),
    };

    const displayPrice =
        priceRange === 0 ? discountedPricesConverted.monthly : discountedPricesConverted.yearly;
    const displayOriginalPrice =
        priceRange === 0 ? originalPricesConverted.monthly : originalPricesConverted.yearly;

    // Convert displayPrice to number if possible
    const priceNumber = !isNaN(Number(displayPrice)) ? Number(displayPrice) : null;

    return (
        <div className="col-span-1 flex justify-center w-full mx-auto">
            <div className={`relative w-full rounded-2xl ${comingSoon ? "overflow-hidden select-none pointer-events-none" : ""}`}>
                <div className={`w-full min-h-[700px] flex flex-col justify-between relative ${className || ""}`}>
                    {isEnterprise ? (
                        // Enterprise plan content with slider at the bottom and "Contact Us" button.
                        <div className="bg-white rounded-2xl h-full p-6 z-50 flex flex-col justify-between min-h-[700px]">
                            <div className="text-center">
                                <h2 className="font-bold text-[24px]">{title}</h2>
                                <p className="text-sm text-gray-600">{description}</p>
                            </div>
                            {/* Enterprise Price Display */}
                            <div className="flex flex-col items-center justify-center mt-4">
                                <div className="flex items-baseline">
                                    {enterpriseListings !== undefined ? (
                                        <>
                                            {priceRange === 0 ? (
                                                // Monthly: discounted price = 90% of base price
                                                <PriceDisplay value={calculateEnterprisePrice(enterpriseListings) * 0.5} currencySymbol={currencySymbol} />
                                            ) : (
                                                // Yearly: discounted price = 90% of (10x base price + 0.09)
                                                <PriceDisplay value={(calculateEnterprisePrice(enterpriseListings) * 10 + 0.09) * 0.5} currencySymbol={currencySymbol} />
                                            )}
                                        </>
                                    ) : (
                                        <span className="font-extrabold text-[40px] text-gray-900">Custom Pricing</span>
                                    )}
                                    <span className="ml-1 text-lg text-black font-semibold">
                                        /{priceRange === 0 ? "mo" : "yr"}
                                    </span>
                                </div>
                                {/* Crossed-out original price */}
                                {enterpriseListings !== undefined && (
                                    <span className="text-md text-gray-500 line-through">
                                        {priceRange === 0
                                            ? `${currencySymbol}${calculateEnterprisePrice(enterpriseListings).toFixed(2)}`
                                            : `${currencySymbol}${(calculateEnterprisePrice(enterpriseListings) * 10 + 0.09).toFixed(2)}`}
                                    </span>
                                )}
                            </div>
                            {/* Features Section */}
                            <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
                            {/* Enterprise Slider at the Bottom */}
                            <div className="flex flex-col items-center justify-end mt-4">
                                <label className="block text-gray-700 mb-2">
                                    AI-Automated Listings:{" "}
                                    {enterpriseListings !== undefined &&
                                        (enterpriseListings === 1500 ? "Unlimited" : enterpriseListings)}
                                </label>
                                <input
                                    type="range"
                                    min={100}
                                    max={1500}
                                    step={50}
                                    value={enterpriseListings}
                                    onChange={(e) => setEnterpriseListings && setEnterpriseListings(Number(e.target.value))}
                                    className="w-full slider-custom-thumb"
                                />
                            </div>
                            {/* Contact Us Button */}
                            <section className="mt-4">
                                <div className="flex">
                                    <a
                                        href={enterpriseContactUrl || discordSupportLink}
                                        className="btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg"
                                    >
                                        Contact Us
                                    </a>
                                </div>
                            </section>
                        </div>
                    ) : (
                        // Non-enterprise plan content (Standard, Pro, Elite)
                        <>
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
                                            {priceNumber !== 0 && Number(displayPrice) !== Number(displayOriginalPrice) && (
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
                                        {priceNumber !== 0 && Number(displayPrice) !== Number(displayOriginalPrice) && (
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
                        </>
                    )}
                </div>
                {comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none backdrop-blur-[4px]">
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
