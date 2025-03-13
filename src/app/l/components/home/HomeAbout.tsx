import HomeAboutSeePlansButton from "./HomeAboutSeePlansButton";
import ClickableBulletPoint from "./HomeClickableBulletPoint";

import { Lato } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

const HomeAbout = () => {
	return (
		<div className="flex justify-center items-center h-full">
			{/* Set to full height */}
			<div className="w-full h-auto flex flex-col justify-center">
				{/* Center the content vertically */}
				<div className="text-center mx-4">
					<h2 className={`${lato.className} text-4xl text-houseBlue md:pt-2 lg:pt-0 font-bold mb-2`}>
						Unlock Automated Profits
					</h2>
					<p className="text-gray-600 mb-4">
						You&apos;re Just One Step Away from Automated Success. See what we have to offer!
					</p>
					<hr className="hr-price-stat mb-4" />
					<div className="mb-6 w-full">
						<h3 className="text-xl font-bold text-gray-700 mb-4">Why Choose Us?</h3>
						<ul className="text-left space-y-2 min-w-xl">
							{/* Adjust space between items */}
							{[
								{ text: "AI-Driven Listing Automation", tooltip: "Skip the tedious work of manual listings. Our AI scans product pages, extracts key details, and instantly generates high-converting eBay listings—optimized with dynamic descriptions, keywords, and the perfect price to maximize sales." },
								{ text: "Intelligent Pricing Adjustments", tooltip: "Never leave money on the table. Flippify's AI continuously analyzes competitor listings, sales velocity, and market trends to auto-adjust your pricing in real-time, ensuring you stay competitive while protecting your margins." },
								{ text: "Smart Inventory Sync & Tracking", tooltip: "Forget spreadsheets and manual updates. Flippify auto-tracks your stock levels, detects slow-moving products, and alerts you when restocking is needed—all while syncing with eBay in real time." },
								{ text: "One-Click Order & Shipping Processing", tooltip: "Shipping has never been easier. With a single click, Flippify generates shipping labels, syncs tracking details with eBay, and selects the best courier options—so all you need to do is drop the package off." },
								{ text: "AI-Powered Financial Insights & Profit Optimization", tooltip: "Get a complete breakdown of your sales, profits, expenses, taxes, and eBay fees in real time. Flippify's AI analyzes your business patterns and suggests strategies to boost profitability and efficiency." },
								{ text: "Multi-Account & Cross-Store Management", tooltip: "Running multiple eBay stores? Flippify consolidates everything into one easy-to-manage dashboard, allowing you to switch between stores, track performance, and apply automation rules across all accounts." },
								{ text: "Seamless Returns & Refund Handling", tooltip: "AI takes the hassle out of returns by auto-processing refund requests, updating inventory, and identifying patterns to help reduce return rates over time. Stay in control while letting automation do the work." },
								{ text: "Future Multi-Platform Support", tooltip: "eBay is just the beginning. Flippify is evolving to bring AI-driven automation to Shopify, Amazon and much more, enabling sellers to manage multiple platforms effortlessly from one central hub." },
								].map((item, index) => (
								<li key={index} className="w-full">
									<ClickableBulletPoint
										text={item.text}
										tooltip={item.tooltip}
									/>
								</li>
							))}
						</ul>
					</div>
					<div className="border-t border-gray-200 pt-6">
						<HomeAboutSeePlansButton />
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeAbout;