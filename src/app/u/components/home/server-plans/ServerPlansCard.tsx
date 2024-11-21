import React from "react";
import PlansContactUs from "./ServerPlansContactUs";
import { BackgroundGradient } from "@/src/components/ui/background-gradient";
import { currencySymbols } from "@/src/config/currency-config";

interface ServerPlansCardProps {
	title: string;
	prices: number[];
	description: string;
	priceIds: { monthly: string; yearly: string };
	whatsIncludedComponent: any;
	specialPlan?: boolean;
	priceRange: number;
	planRole: string;
	currency: string;
	conversionRates: Record<string, number>;
	unavailable?: boolean;
}

const ServerPlansCard: React.FC<ServerPlansCardProps> = ({
	title,
	prices,
	description,
	priceIds,
	whatsIncludedComponent,
	specialPlan,
	priceRange,
	planRole,
	currency,
	conversionRates,
	unavailable = false,
}) => {
	const currencySymbol = currencySymbols[currency];

	const convertedPrices = prices.map((price) =>
		Number((price * conversionRates[currency]).toFixed(2))
	);

	return (
		<div className="col-span-1 relative w-full sm:w-[420px] flex justify-center transition duration-200 px-2 sm:mx-auto 2xl:w-[380px]">
			{/* Card Content */}
			<div className={`w-full sm:w-full min-h-[700px] flex flex-col justify-between relative ${unavailable ? "opacity-50" : ""}`}>
				{specialPlan ? (
					<BackgroundGradient className="z-40">
						<div className="bg-white rounded-2xl h-full p-6 z-50 flex flex-col justify-between min-h-[700px]">
							<div className="absolute top-[-10px] left-6 bg-houseBlue text-white px-3 py-1 rounded-full text-xs">
								Most Popular
							</div>

							{/* Title and Description */}
							<div className="text-center">
								<h2 className="font-bold text-[24px]">{title}</h2>
								<p className="text-sm text-gray-600">{description}</p>
							</div>

							{/* Price Section */}
							<div className="flex flex-col items-center mt-5">
								<span className="text-sm text-gray-400 mb-0">Starting From...</span>
								<div className="flex flex-row items-center">
									<h3 className="font-extrabold text-[40px] text-gray-900">
										{`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
									</h3>
									<span className="ml-1 mt-4 text-lg text-black font-semibold">
										/{priceRange === 0 ? "mo" : "yr"}
									</span>
								</div>
							</div>

							<section className="flex-grow mt-5">{whatsIncludedComponent}</section>

							<section className="mt-auto">
								{!unavailable && (
									<div className="flex flex-col gap-4">
										{/* Always show "Contact Us" button */}
										<PlansContactUs specialPlan={specialPlan} />
									</div>
								)}
							</section>
						</div>
					</BackgroundGradient>
				) : (
					<div className="bg-white border rounded-2xl hover:shadow-md transition duration-200 h-full p-6 flex flex-col justify-between min-h-[700px] relative z-0">
						<div className="text-center">
							<h2 className="font-bold text-[24px]">{title}</h2>
							<p className="text-sm text-gray-600">{description}</p>
						</div>

						{/* Price Section */}
						<div className="flex flex-col items-center mt-5">
							<span className="text-sm text-gray-400 mb-0">Starting From...</span>
							<div className="flex flex-row items-center">
								<h3 className="font-extrabold text-[40px] text-gray-900">
									{`${currencySymbol}${convertedPrices[priceRange].toFixed(2)}`}
								</h3>
								<span className="ml-1 mt-4 text-lg text-black font-semibold">
									/{priceRange === 0 ? "mo" : "yr"}
								</span>
							</div>
						</div>

						<section className="flex-grow mt-4">{whatsIncludedComponent}</section>

						<section className="mt-auto">
							{!unavailable && (
								<div className="flex flex-col gap-4">
									{/* Always show "Contact Us" button */}
									<PlansContactUs />
								</div>
							)}
						</section>
					</div>
				)}

				{/* Coming Soon Box */}
				{unavailable && (
					<div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
						<div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
							Coming Soon
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ServerPlansCard;
