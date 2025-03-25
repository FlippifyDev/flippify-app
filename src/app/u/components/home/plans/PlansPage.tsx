"use client";

// Local Imports
import PlansCard from "./PlansCard";
import PlansCardProWhatsIncluded from "./PlansCardProWhatsIncluded";
import PlansCardFreeWhatsIncluded from "./PlansCardFreeWhatsIncluded";
import PlansCardStandardWhatsIncluded from "./PlansCardStandardWhatsIncluded";

// External Imports
import { Lato, Inter } from "next/font/google";
import { useSession } from "next-auth/react";
import { useState } from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PlansPage = () => {
	const { data: session } = useSession();
	const currency = session?.user.preferences.currency as string;
	const [selectedPlan, setSelectedPlan] = useState<number>(0);
    const conversionRates = { GBP: 0.75, USD: 1, EUR: 0.89, AUD: 1.46, CAD: 1.35 };

	const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedPlan(event.target.checked ? 1 : 0);
	};

	return (
		<div className="w-full h-full flex flex-col items-center relative">
			<div className="flex flex-col items-center space-y-5 text-center mt-6">
				<div className="flex flex-wrap justify-center">
					<p
						className={`${lato.className} text-4xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-houseBlue to-houseHoverBlue bg-clip-text text-transparent py-1`}
					>
						Pricing
						<a
							className={`${inter.className} text-lightModeText text-4xl sm:text-5xl font-bold`}
						>
							{" "}Made Easy
						</a>
					</p>
				</div>
				<div className="flex justify-center w-4/5 sm:w-full">
					<p className="mx-4 mt-[-12px] mb-2 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
						Flexible Plans for Every Reseller: From Beginners to Experts
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

			{/* Subscription Cards */}
			<div className="mt-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8 w-full max-w-screen-xl mx-auto px-4 pb-2 sm:pb-4">
                <PlansCard
                    title="Free"
                    description="For beginners"
                    prices={{ monthly: 0.00, yearly: 0.00 }}
                    discountedPrices={{ monthly: 0.00, yearly: 0.00 }}
                    priceIds={{
                        monthly: "price_1R6XP9JJRepiHZ8dzkbyxDcp",
                        yearly: "price_1R6XSpJJRepiHZ8dgGcDcL0L",
                    }}
                    whatsIncludedComponent={<PlansCardFreeWhatsIncluded />}
                    priceRange={selectedPlan}
                    currency={currency}  
                    conversionRates={conversionRates} 
                />
                <PlansCard
					title="Standard"
					description="For intermediate resellers"
					prices={{ monthly: 9.99, yearly: 99.90 }}
					discountedPrices={{ monthly: 4.99, yearly: 49.90 }}
					priceIds={{
                        monthly: "price_1R6XQMJJRepiHZ8d5Dpu85mA",
                        yearly: "price_1R6XSPJJRepiHZ8d9I1fNhRo",
					}}
					whatsIncludedComponent={<PlansCardStandardWhatsIncluded />}
					priceRange={selectedPlan}
					currency={currency}  
					conversionRates={conversionRates} 
					specialPlan={true}
				/>
				<PlansCard
					title="Pro"
					description="For growing resellers"
					prices={{ monthly: 14.99, yearly: 149.90 }}
					discountedPrices={{ monthly: 9.99, yearly: 99.9 }}
					priceIds={{
                        monthly: "price_1R6XQqJJRepiHZ8ddt9RMSoS",
                        yearly: "price_1R6XRnJJRepiHZ8d42LxIC9l",
					}}
					whatsIncludedComponent={<PlansCardProWhatsIncluded />}
					priceRange={selectedPlan}
					currency={currency}
					conversionRates={conversionRates}
					comingSoon={true}
				/>
			</div>
		</div>
	);
};

export default PlansPage;
