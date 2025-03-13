import ServicesToolsCard from "./ServicesToolsCard";
import { Lato, Inter } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const AmazonServices: React.FC = () => {
	return (
		<div className="flex flex-col justify-center xl:w-11/12 h-full mb-5 mt-5">
			<div className="flex flex-col items-center space-y-3 text-center mb-5">
				<div className="flex justify-center mx-2 animate-fadeInPrimary">
					<p
						className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}
					>
						<a
							className={`${inter.className} mb-8 text-white text-5xl font-bold`}
						>
							Amazon Automation
						</a>
						{/* This is a space */} Services
					</p>
				</div>
				<div className="flex justify-center max-w-2xl animate-fadeInSecondary">
					<p className="mx-4 sm:mx-2 text-white text-md sm:text-lg text-center">
					Streamline your Amazon selling process with AI-powered automation, from product sourcing and FBA management to inventory tracking, pricing optimization, and sales insights.

					</p>
				</div>
			</div>
			<div className="flex flex-wrap justify-center ">
				<ServicesToolsCard
					title="Listing Automation"
					description="Create optimized eBay listings instantly with the use of our browser extension or by pasting a product link. AI extracts product details, generates a title, description, and pricing, and posts the listing automatically."
					disclaimer={null}
					image="/ListingAutomationToolBanner.png"
					comingSoon={true}
				/>
				<ServicesToolsCard
					title="Smart Pricing Optimization"
					description="Stay competitive with AI-driven pricing that adjusts automatically based on the products market trends, competitor listings, and sales performance to maximize profitability."
					disclaimer={null}
					image="/PriceOptimizationToolBanner.png"
					comingSoon={true}
				/>
				<ServicesToolsCard
					title="Inventory Tracking & Management"
					description="Keep full control of your reselling operation with our automated inventory tracker. Monitor your stock levels, current orders, past sales, and purchase history to make informed decisions and streamline your business operations."
					disclaimer={null}
					image="/InventoryTrackingToolBanner.png" 
					comingSoon={true}
				/>
				<ServicesToolsCard
					title="Order & Shipping Automation"
					description="Automatically generate shipping labels, sync tracking with eBay, and notify buyers. AI recommends the best shipping options based on speed and cost."
					disclaimer={null}
					image="/OrderAutomationToolBanner.png"
					comingSoon={true}
				/>
				<ServicesToolsCard
					title="Returns & Refund Management"
					description="Easily manage returns with automated tracking, inventory updates, and refund processing. AI helps reduce return rates by analyzing product performance and pricing issues."
					disclaimer={null}
					image="/RefundAutomationToolBanner.png"
					comingSoon={true}
				/>
				<ServicesToolsCard
					title="Financial Hub & Profit Tracking"
					description="Track your revenue, profits, and fees in real time. AI-driven reports provide insights into best-selling products, expenses, even managing your taxes, and sales trends to help you scale & automate your business."
					disclaimer={null}
					image="/FinancialHubToolBanner.png"
					comingSoon={true}
				/>
				<ServicesToolsCard
					title="Account Management & Store Settings"
					description="Manage all aspects of your eBay store in one place, from messaging & communicating with buyers and store policies to performance tracking and automation settings."
					disclaimer={null}
					image="/AccountAutoManageToolBanner.png"
					comingSoon={true}
				/>
				<ServicesToolsCard
					title="Multi-Account & Business Insights"
					description="Oversee multiple eBay accounts within a single dashboard, compare sales performance, and apply AI-driven automation across all stores."
					disclaimer={null}
					image="/MultiAccountToolBanner.png"
					comingSoon={true}
				/>
			</div>
		</div>
	);
};

export default AmazonServices;
