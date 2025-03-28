"use client";

import React from "react";
import { AiOutlineTag } from "react-icons/ai";
import PlansSubscribeNow from "./PlansSubscribeNow";
import PlansGetAccessButton from "./PlansGetAccessButton";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import ManageMembershipsButton from "./PlansManageMembershipButton";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import { currencySymbols } from "@/config/currency-config";
import { useSpring, animated } from "react-spring";

interface PlansCardProps {
    title: string;
    description: string;
    prices: { monthly: number; yearly: number };
    discountedPrices: { monthly: number; yearly: number };
    priceIds: { monthly: string; yearly: string };
    whatsIncludedComponent: React.ReactNode;
    specialPlan?: boolean;
    priceRange: number;
    className?: string;
    currency: string;
    conversionRates: Record<string, number>;
    comingSoon?: boolean;
    isEnterprise?: boolean;
    enterpriseListings?: number;
    setEnterpriseListings?: (value: number) => void;
    enterpriseContactUrl?: string;
    handleDisplayCouponModal: (priceId: string) => void;
}

// PriceDisplay component for animated prices
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

// Function to calculate enterprise price based on listings (returns price in GBP)
const calculateEnterprisePrice = (value: number): number => {
    const base = 99.99; // £99.99
    const maxPrice = 199.99; // £199.99
    const multiplier = (maxPrice - base) / (1500 - 200);
    return base + (value - 200) * multiplier;
};

const PlansCard: React.FC<PlansCardProps> = ({
    title,
    description,
    prices,
    discountedPrices,
    priceIds,
    whatsIncludedComponent,
    specialPlan = false,
    priceRange,
    className,
    currency,
    conversionRates,
    comingSoon = false,
    isEnterprise = false,
    enterpriseListings,
    setEnterpriseListings,
    enterpriseContactUrl,
    handleDisplayCouponModal
}) => {
    const currencySymbol = currencySymbols[currency as keyof typeof currencySymbols] || "$";

    // Price calculations: Convert from GBP to target currency
    const rateToUSD = conversionRates['USD'];
    const originalPricesConverted = {
        monthly: prices.monthly * (conversionRates[currency] / rateToUSD),
        yearly: prices.yearly * (conversionRates[currency] / rateToUSD),
    };

    const discountedPricesConverted = {
        monthly: discountedPrices.monthly * (conversionRates[currency] / rateToUSD),
        yearly: discountedPrices.yearly * (conversionRates[currency] / rateToUSD),
    };

    const displayPrice = priceRange === 0 ? discountedPricesConverted.monthly : discountedPricesConverted.yearly;
    const displayOriginalPrice = priceRange === 0 ? originalPricesConverted.monthly : originalPricesConverted.yearly;

    // Enterprise price calculations: Convert from GBP to target currency
    const enterpriseBasePrice = isEnterprise && enterpriseListings ? calculateEnterprisePrice(enterpriseListings) : 0;
    const enterpriseDiscountedPriceMonthly = enterpriseBasePrice * 0.5;
    const enterpriseDiscountedPriceYearly = (enterpriseBasePrice * 10 + 0.09) * 0.5;
    const enterpriseOriginalPriceMonthly = enterpriseBasePrice;
    const enterpriseOriginalPriceYearly = enterpriseBasePrice * 10 + 0.09;

    const displayPriceEnterprise =
        (priceRange === 0 ? enterpriseDiscountedPriceMonthly : enterpriseDiscountedPriceYearly) *
        (conversionRates[currency] / rateToUSD);
    const displayOriginalPriceEnterprise =
        (priceRange === 0 ? enterpriseOriginalPriceMonthly : enterpriseOriginalPriceYearly) *
        (conversionRates[currency] / rateToUSD);

    const isFreePlan = prices.monthly === 0 && prices.yearly === 0;
    const selectedPriceId = priceRange === 0 ? priceIds.monthly : priceIds.yearly;

    return (
        <div className="col-span-1 relative w-full flex justify-center transition duration-200 px-2 sm:mx-auto max-w-md">
            <div
                className={`w-full flex flex-col justify-between relative ${className || ""} ${comingSoon ? "opacity-50 pointer-events-none select-none" : ""
                    }`}
            >
                {isEnterprise ? (
                    <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
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
                                {enterpriseListings !== undefined ? (
                                    <PriceDisplay value={displayPriceEnterprise} currencySymbol={currencySymbol} />
                                ) : (
                                    <span className="font-extrabold text-[40px] text-gray-900">Custom Pricing</span>
                                )}
                                <span className="ml-1 text-lg text-black font-semibold">
                                    /{priceRange === 0 ? "mo" : "yr"}
                                </span>
                            </div>
                            {enterpriseListings !== undefined && (
                                <span className="text-md text-gray-500 line-through">
                                    {currencySymbol}
                                    {displayOriginalPriceEnterprise.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
                        {enterpriseListings !== undefined && setEnterpriseListings && (
                            <div className="flex flex-col items-center justify-end mt-4">
                                <label className="block text-gray-700 mb-2">
                                    AI-Automated Listings: {enterpriseListings === 1500 ? "Unlimited" : enterpriseListings}
                                </label>
                                <input
                                    type="range"
                                    min={200}
                                    max={1500}
                                    step={50}
                                    value={enterpriseListings}
                                    onChange={(e) => setEnterpriseListings(Number(e.target.value))}
                                    className="w-full slider-custom-thumb"
                                />
                            </div>
                        )}
                        {!comingSoon && (
                            <section className="mt-4">
                                <div className="flex">
                                    <a
                                        href={enterpriseContactUrl || "/contact"}
                                        className="btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg"
                                    >
                                        Contact Us
                                    </a>
                                </div>
                            </section>
                        )}
                    </div>
                ) : specialPlan ? (
                    <BackgroundGradient className="z-30">
                        <div className="bg-white rounded-2xl p-6 flex flex-col justify-between">
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
                                    {isFreePlan ? (
                                        <span className="font-extrabold text-[40px] text-gray-900">Free</span>
                                    ) : (
                                        <>
                                            <PriceDisplay value={displayPrice} currencySymbol={currencySymbol} />
                                            <span className="ml-1 text-lg text-black font-semibold">
                                                /{priceRange === 0 ? "mo" : "yr"}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {!isFreePlan && Number(displayPrice) !== Number(displayOriginalPrice) && (
                                    <span className="text-md text-gray-500 line-through">
                                        {currencySymbol}
                                        {displayOriginalPrice.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
                            <section className="mt-auto">
                                <div className="flex flex-col items-center gap-3">
                                    {!comingSoon && (
                                        <>
                                            <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                                                <PlansGetAccessButton redirect="dashboard" specialPlan={specialPlan} />
                                            </LayoutSubscriptionWrapper>
                                            <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", `!${title.toLowerCase()}`]}>
                                                <PlansSubscribeNow priceId={selectedPriceId} specialPlan={specialPlan} handleDisplayCouponModal={handleDisplayCouponModal} displayModal={true} />
                                            </LayoutSubscriptionWrapper>
                                            <LayoutSubscriptionWrapper requiredSubscriptions={[title.toLowerCase()]}>
                                                <ManageMembershipsButton specialPlan={specialPlan} />
                                            </LayoutSubscriptionWrapper>
                                        </>
                                    )}
                                </div>
                            </section>
                        </div>
                    </BackgroundGradient>
                ) : (
                    <div className="bg-white border rounded-2xl hover:shadow-md transition duration-200 p-6 flex flex-col justify-between">
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
                                {isFreePlan ? (
                                    <span className="font-extrabold text-[40px] text-gray-900">Free</span>
                                ) : (
                                    <PriceDisplay value={displayPrice} currencySymbol={currencySymbol} />
                                )}
                                <span className="ml-1 text-lg text-black font-semibold">
                                    /{priceRange === 0 ? "mo" : "yr"}
                                </span>
                            </div>
                            {!isFreePlan && Number(displayPrice) !== Number(displayOriginalPrice) && (
                                <span className="text-md text-gray-500 line-through">
                                    {currencySymbol}
                                    {displayOriginalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>
                        <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
                        <section className="mt-auto">
                            <div className="flex flex-col items-center gap-3">
                                {!comingSoon && (
                                    <>
                                        <LayoutSubscriptionWrapper requiredSubscriptions={["!accessGranted"]}>
                                            <PlansGetAccessButton redirect="dashboard" specialPlan={specialPlan} />
                                        </LayoutSubscriptionWrapper>
                                        <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", `!${title.toLowerCase()}`]}>
                                            <PlansSubscribeNow priceId={selectedPriceId} specialPlan={specialPlan} handleDisplayCouponModal={handleDisplayCouponModal} displayModal={true} />
                                        </LayoutSubscriptionWrapper>
                                        <LayoutSubscriptionWrapper requiredSubscriptions={[title.toLowerCase()]}>
                                            <ManageMembershipsButton specialPlan={specialPlan} />
                                        </LayoutSubscriptionWrapper>
                                    </>
                                )}
                            </div>
                        </section>
                    </div>
                )}
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