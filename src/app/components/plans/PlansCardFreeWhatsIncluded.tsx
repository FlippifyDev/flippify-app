import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardFreeWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

	return (
		<div className="mb-4">
			<div className="text-black font-semibold pt-2 pl-2 mb-[-6px]">
				<p>Features Include:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="12 Auto-Tracked Listings /Month"
                        tooltip="Track up to 12 new eBay listings monthly. Log the purchase, and we&apos;ll automatically monitor inventory, sales, and financials. Limit resets each month; active tracked items don&apos;t count toward the next month&apos;s cap. On initial sign-up we can only track 90 days in the past and up to 100 items."
					/>
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="12 Manual Transaction Entries"
                        tooltip="Manually log purchases and sales to track them in your inventory, orders, and financials. You manage the item&apos;s status, such as moving it between inventory and orders, without automated tracking."
                    />
                </li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Inventory & Order Management Access"
						tooltip="Manage your inventory and orders with simple tools to track stock levels and fulfill sales."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Financial Tracking Access"
						tooltip="Keep tabs on profits, costs, and sales with straightforward financial summaries."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Single eBay Store Management"
						tooltip="Link and manage one eBay store, syncing your sales and tracking data effortlessly."
					/>
				</li>
			</ul>

			<div className="text-black font-semibold ml-2 mb-[-6px]">
				<p>Coming Soon:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="5 AI Automated Listings"
						tooltip="Provide a product link, and our AI will create, list, and manage 5 listings for you, tracking them through to sale."
						comingSoon
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardFreeWhatsIncluded;