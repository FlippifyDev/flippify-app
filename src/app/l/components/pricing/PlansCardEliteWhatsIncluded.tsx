import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint"; // Correct import path for ClickableBulletPoint


const PlansCardEliteWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

	return (
		<div className="mb-4">
			<div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
				<p>Everything in Pro, plus:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="500 Manual Listings"
						tooltip="Receive a personalized 1-on-1 onboarding session. You&apos;ll get expert guidance on how to maximize your experience with our tools and services."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="100 Automatic Listings"
						tooltip="Have weekly 1-on-1 calls with our experts to ensure your success and growth as a reseller."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Full Inventory & Order Management"
						tooltip="Join an exclusive VIP community of elite resellers for networking, insider knowledge, and special events."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Multi-Store Inventory Sync"
						tooltip="Be the first to try out new features in beta before they are released to the general public."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Advanced AI Listing Optimization & Smart Price Adjustments"
						tooltip="Be the first to try out new features in beta before they are released to the general public."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Manage up to 5 eBay Stores"
						tooltip="Be the first to try out new features in beta before they are released to the general public."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Priority AI Processing for Faster Listings & Insights"
						tooltip="Be the first to try out new features in beta before they are released to the general public."
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardEliteWhatsIncluded;
