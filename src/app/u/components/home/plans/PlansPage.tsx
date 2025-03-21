"use client";

// Local Imports
import PlansCard from "./PlansCard";
import PlansCardProWhatsIncluded from "./PlansCardProWhatsIncluded";
import PlansCardEliteWhatsIncluded from "./PlansCardEliteWhatsIncluded";
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
	const conversionRates = { GBP: 1, USD: 1.33, EUR: 1.19, AUD: 1.95, CAD: 1.8 };

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
					title="Standard"
					description="For beginners"
					prices={{ monthly: 24.99, yearly: 249.99 }}
					discountedPrices={{ monthly: 19.99, yearly: 199.99 }}
					priceIds={{
						monthly: "price_1PxRRCJJRepiHZ8dXF4MyyCO",
						yearly: "price_1PxRRMJJRepiHZ8duiGgCQI8",
					}}
					whatsIncludedComponent={<PlansCardStandardWhatsIncluded />}
					priceRange={selectedPlan}
					currency={currency}  // Passing the currency prop
					conversionRates={conversionRates} // Passing the conversionRates prop
					specialPlan={true}
				/>
				<PlansCard
					title="Pro"
					description="For growing resellers"
					prices={{ monthly: 49.99, yearly: 499.99 }}
					discountedPrices={{ monthly: 29.99, yearly: 299.99 }}
					priceIds={{
						monthly: "price_1Px4KUJJRepiHZ8d1wnDMoUZ",
						yearly: "price_1PxRQIJJRepiHZ8dGuGOAkE3",
					}}
					whatsIncludedComponent={<PlansCardProWhatsIncluded />}
					priceRange={selectedPlan}
					currency={currency}
					conversionRates={conversionRates}
					comingSoon={true}
				/>
				<PlansCard
					title="Elite"
					description="For experts"
					prices={{ monthly: 79.99, yearly: 799.99 }}
					discountedPrices={{ monthly: 49.99, yearly: 499.99 }}
					priceIds={{
						monthly: "price_1Px4LdJJRepiHZ8dqBON3u0T",
						yearly: "price_1PxRPnJJRepiHZ8dk2i4Yjql",
					}}
					whatsIncludedComponent={<PlansCardEliteWhatsIncluded />}
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
