"use client";

import React from "react";
import ButtonGetAccess from "./ButtonGetAccess";
import { AiOutlineTag } from "react-icons/ai";
import ButtonGetStarted from "./ButtonGetStarted";
import { currencySymbols } from "@/config/currency-config";
import ButtonManageMembership from "./ButtonManageMembership";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useSpring, animated } from "react-spring";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import ButtonUpgradeSubscription from "./ButtonUpgradeSubscription";
import { SubscriptionName } from "@/models/store-data";


// PriceDisplay component for animated prices
interface PriceDisplayProps {
    value: number;
    currencySymbol: string;
}
export const PriceDisplay: React.FC<PriceDisplayProps> = ({ value, currencySymbol }) => {
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


interface PlansCardProps {
    title: string;
    description: string;
    discountedPrices: { monthly: number; yearly: number };
    priceIds: { monthly: string; yearly: string };
    whatsIncludedComponent: React.ReactNode;
    isOnboarding: boolean;
    currentSubscriptionName: SubscriptionName | null;
    specialPlan?: boolean;
    priceRange: number;
    className?: string;
    currency: string;
    conversionRates: Record<string, number>;
    comingSoon?: boolean;
    handleDisplayModal: (priceId: string, type: string) => void;
}
const PlansCard: React.FC<PlansCardProps> = ({
    title,
    description,
    discountedPrices,
    priceIds,
    isOnboarding,
    currentSubscriptionName,
    whatsIncludedComponent,
    specialPlan = false,
    priceRange,
    className,
    currency,
    conversionRates,
    comingSoon = false,
    handleDisplayModal
}) => {
    const currencySymbol = currencySymbols[currency as keyof typeof currencySymbols] || "$";

    // Price calculations: Convert from GBP to target currency
    const rateToUSD = conversionRates['USD'];

    const discountedPricesConverted = {
        monthly: discountedPrices.monthly * (conversionRates[currency] / rateToUSD),
        yearly: discountedPrices.yearly * (conversionRates[currency] / rateToUSD),
    };

    const displayPrice = priceRange === 0 ? discountedPricesConverted.monthly : discountedPricesConverted.yearly;

    const isFreePlan = discountedPrices.monthly === 0 && discountedPrices.yearly === 0;
    const selectedPriceId = priceRange === 0 ? priceIds.monthly : priceIds.yearly;

    return (
        <div className="col-span-1 relative w-full h-full flex justify-center transition duration-200 px-2 sm:mx-auto max-w-md">
            <div
                className={`w-full h-full flex flex-col justify-between relative ${className || ""} ${comingSoon ? "opacity-50 pointer-events-none select-none" : ""
                    }`}
            >
                {specialPlan ? (
                    <BackgroundGradient className="z-30 h-full" containerClassName="h-full">
                        <div className="h-full bg-white rounded-2xl p-6 flex flex-col justify-between">
                            <div className="absolute top-[-10px] left-6 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
                                Most Popular
                            </div>
                            <PlansCardInfo
                                title={title}
                                description={description}
                                isOnboarding={isOnboarding}
                                currentSubscriptionName={currentSubscriptionName}
                                isFreePlan={isFreePlan}
                                displayPrice={displayPrice}
                                currencySymbol={currencySymbol}
                                priceRange={priceRange}
                                whatsIncludedComponent={whatsIncludedComponent}
                                specialPlan={specialPlan}
                                selectedPriceId={selectedPriceId}
                                comingSoon={comingSoon}
                                handleDisplayModal={handleDisplayModal}
                            />
                        </div>
                    </BackgroundGradient>
                ) : (
                    <div className="h-full bg-white border rounded-2xl hover:shadow-md transition duration-200 p-6 flex flex-col justify-between">
                        <PlansCardInfo
                            title={title}
                            description={description}
                            isOnboarding={isOnboarding}
                            currentSubscriptionName={currentSubscriptionName}
                            isFreePlan={isFreePlan}
                            displayPrice={displayPrice}
                            currencySymbol={currencySymbol}
                            priceRange={priceRange}
                            whatsIncludedComponent={whatsIncludedComponent}
                            specialPlan={specialPlan}
                            selectedPriceId={selectedPriceId}
                            comingSoon={comingSoon}
                            handleDisplayModal={handleDisplayModal}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};


interface PlansCardInfoProps {
    title: string;
    description: string;
    currentSubscriptionName: SubscriptionName | null;
    isOnboarding: boolean;
    isFreePlan: boolean;
    displayPrice: number;
    currencySymbol: string;
    priceRange: number;
    whatsIncludedComponent: React.ReactNode;
    specialPlan?: boolean;
    selectedPriceId: string;
    comingSoon?: boolean;
    handleDisplayModal: (priceId: string, type: string) => void;
}
export const PlansCardInfo: React.FC<PlansCardInfoProps> = ({
    title,
    description,
    isOnboarding,
    currentSubscriptionName,
    isFreePlan,
    displayPrice,
    currencySymbol,
    priceRange,
    whatsIncludedComponent,
    specialPlan,
    selectedPriceId,
    comingSoon,
    handleDisplayModal
}) => {
    return (
        <>
            <div className="text-center">
                <h2 className="font-bold text-[24px]">{title}</h2>
                <p className="text-sm text-gray-600">{description}</p>
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
            </div>
            <section className="flex-grow mt-5">{whatsIncludedComponent}</section>
            <section className="mt-auto">
                <div className="flex flex-col items-center gap-3">
                    {!comingSoon && !isOnboarding && (
                        <>
                            <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", `!${title.toLowerCase()}`]}>
                                {currentSubscriptionName ? (
                                    <ButtonUpgradeSubscription priceId={selectedPriceId} currentSubscriptionName={currentSubscriptionName} planTitle={title} specialPlan={specialPlan} handleDisplayModal={handleDisplayModal} displayModal={true} />
                                ) : (
                                    <ButtonGetStarted priceId={selectedPriceId} specialPlan={specialPlan} handleDisplayModal={handleDisplayModal} displayModal={isFreePlan ? false : true} />
                                )}
                            </LayoutSubscriptionWrapper>

                            <LayoutSubscriptionWrapper requiredSubscriptions={[title.toLowerCase()]}>
                                <ButtonManageMembership specialPlan={specialPlan} />
                            </LayoutSubscriptionWrapper>
                        </>
                    )}
                    {isOnboarding && (
                        <ButtonGetAccess redirect="dashboard" specialPlan={specialPlan} />
                    )}
                </div>
            </section >
        </>
    )
}

export default PlansCard;