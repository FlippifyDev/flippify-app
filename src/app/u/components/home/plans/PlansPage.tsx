"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Lato, Inter } from "next/font/google";
import PlansCard from "./PlansCard";
import PlansCardFreeWhatsIncluded from "@/app/components/plans/PlansCardFreeWhatsIncluded";
import PlansCardStandardWhatsIncluded from "@/app/components/plans/PlansCardStandardWhatsIncluded";
import PlansCardProWhatsIncluded from "@/app/components/plans/PlansCardProWhatsIncluded";
import PlansSubscribeNow from "./ButtonGetStarted";
import Modal from "../../dom/ui/Modal";
import ButtonUpgradeSubscription from "./ButtonUpgradeSubscription";
import { fetchConversionRates } from "@/utils/currency-api";
import { validateAlphaNumericInput } from "@/utils/input-validation";
import { FREE_MONTHLY_PID, FREE_YEARLY_PID, MAX_INPUT_LENGTH, PRO_MONTHLY_PID, PRO_YEARLY_PID, STANDARD_MONTHLY_PID, STANDARD_YEARLY_PID } from "@/utils/constants";
import EnterpriseCard from "./EnterpriseCard";

type Currency = "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";

const PlansPage = () => {
    const { data: session } = useSession();
    const currency = (session?.user.preferences?.currency as Currency) || "USD";
    const [selectedPlan, setSelectedPlan] = useState<number>(0); // 0 for monthly, 1 for yearly
    const [displayCouponModal, setDisplayCouponModal] = useState<boolean>(false);
    const [displaySubscriptionChangeModal, setDisplaySubscriptionChangeModal] = useState<boolean>(false);
    const [priceId, setPriceId] = useState<string>("");
    const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [currentSubscriptionName, setCurrentSubscriptionName] = useState<string | null>(null);
    const [isOnboarding, setIsOnboarding] = useState<boolean>(false);
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


    function handleDisplayModal(priceId: string, type: string) {
        setPriceId(priceId);
        setCouponError(null);
        if (type === "coupon") {
            setDisplayCouponModal(true);
        } else if (type === "subscriptionChange") {
            setDisplaySubscriptionChangeModal(true);
        }
    }

    useEffect(() => {
        if (session?.user.subscriptions) {
            const subscription = session.user.subscriptions.find((sub: any) => sub.name.includes("member"));
            if (subscription && subscription.name) {
                setCurrentSubscriptionName(subscription.name);
            }
            if (session.user.authentication?.onboarding) {
                setIsOnboarding(true);
            }
        }
    }, [session]);


    function handleInput(value: string, type: string) {
        if (value.length > MAX_INPUT_LENGTH) return;

        if (type === "coupon") {
            validateAlphaNumericInput(value, setCouponCode);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center relative p-2 sm:p-4">
            {displayCouponModal && (
                <Modal setDisplayModal={setDisplayCouponModal}>
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        <h3 className="text-xl font-semibold mb-4 text-center">Enter coupon code</h3>

                        <input
                            type="text"
                            value={couponCode ?? ""}
                            onChange={(e) => handleInput(e.target.value, "coupon")}
                            placeholder="Coupon Code (optional)"
                            className="input input-bordered w-full"
                            aria-label="Coupon Code"
                            aria-required="false"
                        />

                        {couponError && (
                            <p className="text-red-500 text-sm mt-2 w-full text-center">{couponError}</p>
                        )}

                        <PlansSubscribeNow
                            priceId={priceId}
                            handleDisplayModal={handleDisplayModal}
                            displayModal={false}
                            couponCode={couponCode}
                            setCouponError={setCouponError}
                        />
                    </div>
                </Modal>
            )}

            {displaySubscriptionChangeModal && (
                <Modal setDisplayModal={setDisplaySubscriptionChangeModal} className="">
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                        <h3 className="text-xl font-semibold mb-4 text-center">Subscription Change</h3>
                        <p className="text-sm text-center mb-4">
                            Are you sure you want to change your subscription? This will update your current plan and may incur additional charges.
                        </p>

                        <input
                            type="text"
                            value={couponCode ?? ""}
                            onChange={(e) => handleInput(e.target.value, "coupon")}
                            placeholder="Coupon Code (optional)"
                            className="input input-bordered w-full"
                            aria-label="Coupon Code"
                            aria-required="false"
                        />

                        {couponError && (
                            <p className="text-red-500 text-sm mt-2 w-full text-center">{couponError}</p>
                        )}

                        <ButtonUpgradeSubscription
                            priceId={priceId}
                            handleDisplayModal={handleDisplayModal}
                            displayModal={false}
                            coupon={couponCode}
                            setCouponError={setCouponError}
                        />
                    </div>
                </Modal>
            )}
            <div className="w-full flex flex-col items-center space-y-5 mt-6">
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

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 w-full mx-auto px-2 sm:px-4 pb-2 sm:pb-4">
                <PlansCard
                    title="Standard"
                    description="For growing resellers"
                    discountedPrices={{ monthly: 9.99, yearly: 99.90 }}
                    priceIds={{
                        monthly: STANDARD_MONTHLY_PID,
                        yearly: STANDARD_YEARLY_PID,
                    }}
                    isOnboarding={isOnboarding}
                    currentSubscriptionName={currentSubscriptionName}
                    whatsIncludedComponent={<PlansCardStandardWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    specialPlan
                    handleDisplayModal={handleDisplayModal}
                />
                <PlansCard
                    title="Pro"
                    description="For experts"
                    discountedPrices={{ monthly: 19.99, yearly: 199.90 }}
                    priceIds={{
                        monthly: PRO_MONTHLY_PID,
                        yearly: PRO_YEARLY_PID,
                    }}
                    isOnboarding={isOnboarding}
                    currentSubscriptionName={currentSubscriptionName}
                    whatsIncludedComponent={<PlansCardProWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    handleDisplayModal={handleDisplayModal}
                />
                <EnterpriseCard
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    currentSubscriptionName={currentSubscriptionName}
                    handleDisplayModal={handleDisplayModal}
                    isOnboarding={isOnboarding}
                />
            </div>
        </div>
    );
};

export default PlansPage;