"use client";

import React, { useEffect, useState } from 'react'
import { PriceDisplay } from './PlansCard';
import { currencySymbols } from '@/config/currency-config';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import ButtonGetAccess from './ButtonGetAccess';
import ButtonManageMembership from './ButtonManageMembership';
import ButtonUpgradeSubscription from './ButtonUpgradeSubscription';
import ButtonGetStarted from './ButtonGetStarted';
import { ENTERPRISE_MONTHLY_PIDS, ENTERPRISE_YEARLY_PIDS, subscriptionLimits } from '@/utils/constants';
import PlansCardEnterpriseWhatsIncluded from '@/app/components/plans/PlansCardEnterpriseWhatsIncluded';
import { SubscriptionName } from '@/models/store-data';

interface EnterpriseCardProps {
    currentSubscriptionName: SubscriptionName | null;
    isOnboarding: boolean;
    currency: string;
    conversionRates: Record<string, number>;
    priceRange: number;
    handleDisplayModal: (priceId: string, type: string) => void;
}
const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
    currentSubscriptionName,
    isOnboarding,
    currency,
    conversionRates,
    priceRange,
    handleDisplayModal
}) => {
    const description = "For large scale operations";
    const [discountedPriceMonthly, setDiscountedPriceMonthly] = useState(19.99);
    const [discountedPriceYearly, setDiscountedPriceYearly] = useState(199.90);
    
    const [index, setIndex] = useState(0);
    const title = `Enterprise ${index+1}`;
    const [listings, setListings] = useState(subscriptionLimits["enterprise 1"].automatic);


    const [priceIdMonthly, setPriceIdMonthly] = useState("");
    const [priceIdYearly, setPriceIdYearly] = useState("");

    useEffect(() => {
        setPriceIdMonthly(ENTERPRISE_MONTHLY_PIDS[index][0] as string);
        setPriceIdYearly(ENTERPRISE_YEARLY_PIDS[index][0] as string);
        setDiscountedPriceMonthly(ENTERPRISE_MONTHLY_PIDS[index][1] as number);
        setDiscountedPriceYearly(ENTERPRISE_YEARLY_PIDS[index][1] as number);

        const key = `enterprise ${index + 1}` as keyof typeof subscriptionLimits;
        const limits = subscriptionLimits[key]
        setListings(limits.automatic);
    }, [index]);

    const currencySymbol = currencySymbols[currency as keyof typeof currencySymbols] || "$";

    // Price calculations: Convert from GBP to target currency
    const rateToUSD = conversionRates['USD'];

    const discountedPricesConverted = {
        monthly: discountedPriceMonthly * (conversionRates[currency] / rateToUSD),
        yearly: discountedPriceYearly * (conversionRates[currency] / rateToUSD),
    };

    const displayPrice = priceRange === 0 ? discountedPricesConverted.monthly : discountedPricesConverted.yearly;

    const selectedPriceId = priceRange === 0 ? priceIdMonthly : priceIdYearly;

    return (
        <div className="col-span-1 w-full px-2 sm:mx-auto max-w-md">
            <div className="w-full bg-white border rounded-2xl hover:shadow-md transition duration-200 p-6 flex flex-col justify-between">
                <div className="text-center">
                    <h2 className="font-bold text-[24px]">Enterprise</h2>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="flex items-baseline">
                        <PriceDisplay value={displayPrice} currencySymbol={currencySymbol} />
                        <span className="ml-1 text-lg text-black font-semibold">
                            /{priceRange === 0 ? "mo" : "yr"}
                        </span>
                    </div>
                </div>
                <section className="flex-grow mt-5">{<PlansCardEnterpriseWhatsIncluded listings={listings} />}</section>
                <div className="flex flex-col items-center justify-center my-12 px-8">
                    <input
                        type="range"
                        min={0}
                        max={3}
                        step={1}
                        value={index}
                        onChange={(e) => setIndex(Number(e.target.value))}
                        className="range-slider"
                    />
                </div>
                <section className="">
                    <div className="flex flex-col items-center gap-3">
                        {!isOnboarding && (
                            <>
                                <LayoutSubscriptionWrapper requiredSubscriptions={["accessGranted", `!${title.toLowerCase()}`]}>
                                    {currentSubscriptionName ? (
                                        <ButtonUpgradeSubscription priceId={selectedPriceId} currentSubscriptionName={currentSubscriptionName} planTitle={title} handleDisplayModal={handleDisplayModal} displayModal={true} />
                                    ) : (
                                        <ButtonGetStarted priceId={selectedPriceId} handleDisplayModal={handleDisplayModal} displayModal={true} />
                                    )}
                                </LayoutSubscriptionWrapper>

                                <LayoutSubscriptionWrapper requiredSubscriptions={[title.toLowerCase()]}>
                                    <ButtonManageMembership />
                                </LayoutSubscriptionWrapper>
                            </>
                        )}
                        {isOnboarding && (
                            <ButtonGetAccess redirect="dashboard" />
                        )}
                    </div>
                </section >

            </div>
        </div>
    )
}

export default EnterpriseCard
