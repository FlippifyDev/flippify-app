import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardStandardWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

	return (
		<div className="mb-4">
			<div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
				<p>Everything in Free, plus:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="100 Manual Listings"
						tooltip="Get prioritized support with a dedicated team ready to assist you as soon as possible. Whether it's a simple question or a complex issue, help will always be on hand."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Advanced Inventory & Order Management"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Advanced Financial Tracking"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
					/>
				</li>
			</ul>

			<div className="text-black font-semibold ml-2 mb-[-6px]">
				<p>Coming Soon:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="25 Automatic Listings"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Shipping Label Generator"
						tooltip="Connect your eBay account to Flippify, allowing us to track your sales, automatically list purchases, and handle everything in between. Say goodbye to manual entries and enjoy seamless automation."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Multi-Account Support (Manage 2 eBay Stores)"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Smart AI Listing Optimization"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="AI-Powered Financial Reports"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Bulk Editing & Relisting Automation"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Scheduled Listings & Auto-Drafts"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="AI-Optimized Shipping Selection"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
						comingSoon
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardStandardWhatsIncluded;
