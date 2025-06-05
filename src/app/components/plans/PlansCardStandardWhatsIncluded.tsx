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
                        text="48 Auto-Tracked Sales /Month"
                        tooltip="Track up to 48 new eBay sales monthly. Automatically monitor inventory, sales, and financials. Limit resets each month; active tracked items don&apos;t count toward the next month&apos;s cap. On initial sign-up we can only track 90 days in the past and up to 50 items."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="48 Auto-Tracked Listings"
                        tooltip="Track up to 48 listings at any time. Add custom information such as purchase price, platform, etc. When this listing sells, or you move it to sold then the listing is removed from your total and you can add another listing."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="48 Manual Sales Entries /Month"
                        tooltip="Manually log sales to track them in your orders, and financials. You manage the item&apos;s status, such as moving it between inventory and orders, without automated tracking."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="48 Manual Listing Entries"
                        tooltip="Manually add up to 48 listings at any time. Add custom information such as purchase price, platform, etc. When this listing sells, or you move it to sold then the listing is removed from your total and you can add another listing."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text={`100 One Time Expense Entries /Month`}
                        tooltip={`Record up to 100 individual one-time expenses, such as shipping supplies, equipment, or other non-recurring costs. These help calculate your net profit more accurately.`}
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text={`6 Subscription Expense Entries`}
                        tooltip={`Track up to 6 recurring expenses like monthly software, platform fees, or memberships. These entries are included in your ongoing expense calculations.`}
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Export to CSV"
                        tooltip="Easily export your inventory, orders, and financials to CSV format for external use."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Import existing data"
                        tooltip="Easily import your existing orders directly into Flippify, in just a few simple steps."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Tax reporting"
                        tooltip="Easily export your inventory, orders, and financials to CSV format for external use."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Market Comparison"
                        tooltip="Instantly compare listing and sold prices across multiple marketplaces to identify the best deals and trends."
                    />
                </li>
			</ul>
		</div>
	);
};

export default PlansCardStandardWhatsIncluded;