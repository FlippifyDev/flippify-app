"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Lato, Inter } from "next/font/google";
import PlansCard from "./PlansCard";
import PlansCardBasicWhatsIncluded from "./PlansCardFreeWhatsIncluded";
import PlansCardStandardWhatsIncluded from "./PlansCardStandardWhatsIncluded";
import PlansCardEliteWhatsIncluded from "./PlansCardProWhatsIncluded";
import PlansCardEnterpriseWhatsIncluded from "./PlansCardEnterpriseWhatsIncluded";
import { IoClose } from "react-icons/io5";
import PlansSubscribeNow from "./PlansSubscribeNow";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

type Currency = "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";

const PlansPage = () => {
    const { data: session } = useSession();
    const currency = (session?.user.preferences.currency as Currency) || "GBP";
    const [selectedPlan, setSelectedPlan] = useState<number>(0); // 0 for monthly, 1 for yearly
    const [enterpriseListings, setEnterpriseListings] = useState<number>(200);
    const [displayCouponModal, setDisplayCouponModal] = useState<boolean>(false);
    const [priceId, setPriceId] = useState<string>("");
    const [couponCode, setCouponCode] = useState<string | undefined>(undefined);
    const [couponError, setCouponError] = useState<string | null>(null);

    const conversionRates = {
        GBP: 1,
        USD: 1.29,
        EUR: 1.19,
        AUD: 2.05,
        CAD: 1.86,
        JPY: 192.53,
        NZD: 2.26,
    };

    const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPlan(event.target.checked ? 1 : 0);
    };


    function handleDisplayCouponModal(priceId: string) {
        setPriceId(priceId);
        setDisplayCouponModal(true);
    }


    return (
        <div className="w-full h-full flex flex-col items-center relative">
            {displayCouponModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-40">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
                        {/* Close Button (Cross Icon) */}
                        <button
                            className="absolute -top-5 -right-5 text-white rounded-full bg-[#3c424b] p-2 shadow-gray-700 shadow-[rgba(0,0,0,0.2)_-2px_2px_8px] z-50"
                            onClick={() => setDisplayCouponModal(false)}
                        >
                            <IoClose size={24} />
                        </button>


                        <div className="w-full flex flex-col items-center justify-center gap-4 borer">
                            <h3 className="text-xl font-semibold mb-4 text-center">Enter coupon code</h3>

                            <input
                                type="text"
                                value={couponCode ?? ""}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
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
                                handleDisplayCouponModal={handleDisplayCouponModal}
                                displayModal={false}
                                couponCode={couponCode}
                                setCouponError={setCouponError}
                            />
                        </div>

                    </div>
                </div>
            )}
            <div className="flex flex-col items-center space-y-5 text-center mt-6">
                <div className="flex flex-wrap justify-center">
                    <p
                        className={`${lato.className} text-4xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-houseBlue to-houseHoverBlue bg-clip-text text-transparent py-1`}
                    >
                        Pricing
                        <a className={`${inter.className} text-lightModeText text-4xl sm:text-5xl font-bold`}>
                            {" "}
                            Made Easy
                        </a>
                    </p>
                </div>
                <div className="flex justify-center w-4/5 sm:w-full">
                    <p className="mx-4 mt-[-12px] mb-2 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
                        Flexible Plans for Every eBay Seller: From Beginners to Experts
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

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-8 w-full mx-auto px-2 sm:px-4 pb-2 sm:pb-4">
                <PlansCard
                    title="Free"
                    description="For beginners"
                    prices={{ monthly: 0, yearly: 0 }}
                    discountedPrices={{ monthly: 0, yearly: 0 }}
                    priceIds={{
                        monthly: "price_1R6umYJJRepiHZ8duYSajDvz",
                        yearly: "price_1R6umYJJRepiHZ8d7eBwpE78",
                    }}
                    whatsIncludedComponent={<PlansCardBasicWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    specialPlan
                    handleDisplayCouponModal={handleDisplayCouponModal}
                />
                <PlansCard
                    title="Standard"
                    description="For growing resellers"
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
                    handleDisplayCouponModal={handleDisplayCouponModal}
                />
                <PlansCard
                    title="Pro"
                    description="For experts"
                    prices={{ monthly: 29.99, yearly: 299.99 }}
                    discountedPrices={{ monthly: 19.99, yearly: 199.99 }}
                    priceIds={{
                        monthly: "price_1R6umUJJRepiHZ8dEZib7Bd1",
                        yearly: "price_1R6umUJJRepiHZ8dUeqJXo5d",
                    }}
                    whatsIncludedComponent={<PlansCardEliteWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}
                    conversionRates={conversionRates}
                    comingSoon
                    handleDisplayCouponModal={handleDisplayCouponModal}
                />
                <PlansCard
                    title="Enterprise"
                    description="For Large Scale Operations"
                    prices={{ monthly: 199.99, yearly: 1999.99 }}
                    discountedPrices={{ monthly: 99.99, yearly: 999.99 }}
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
                    handleDisplayCouponModal={handleDisplayCouponModal}
                />
            </div>
        </div>
    );
};

export default PlansPage;