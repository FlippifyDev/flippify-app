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
						text="100 Auto-Tracked Listings /Month"
						tooltip="Track up to 100 new eBay listings monthly. Log the purchase, and we&apos;ll automatically monitor inventory, sales, and financials. Limit resets each month; active tracked items don&apos;t count toward the next month&apos;s cap."
					/>
				</li>
			</ul>

			<div className="text-black font-semibold ml-2 mb-[-6px]">
				<p>Coming Soon:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="20 AI Automated Listings"
						tooltip="Provide a product link, and our AI will create, list, and manage 25 listings for you, tracking them through to sale."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="100 Manual Transaction Entries"
						tooltip="Manually log purchases and sales to track them in your inventory, orders, and financials. You manage the item&apos;s status, such as moving it between inventory and orders, without automated tracking."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Shipping Label Generator"
						tooltip="Print shipping labels directly from the platform for faster order processing."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Multi-Account Support (Manage 2 eBay Stores)"
						tooltip="Link and manage two eBay stores, syncing data across both."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Smart AI Listing Optimization"
						tooltip="Boost listing performance with AI suggestions for titles, descriptions, and pricing."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="AI-Powered Financial Reports"
						tooltip="Unlock advanced financial insights and predictions driven by AI."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Bulk Editing & Relisting Automation"
						tooltip="Edit multiple listings at once and automatically relist unsold items."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Scheduled Listings & Auto-Drafts"
						tooltip="Set listings to go live on a schedule and auto-save drafts for later."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="AI-Optimized Shipping Selection"
						tooltip="Let AI pick the best shipping options based on cost and speed."
						comingSoon
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardStandardWhatsIncluded;