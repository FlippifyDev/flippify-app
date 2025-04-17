import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardProWhatsIncluded = () => {
    const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

    return (
        <div className="mb-4">
            <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
                <p>Everything in Standard, plus:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="96 Auto-Tracked Sales /Month"
                        tooltip="Track up to 96 new eBay sales monthly. Automatically monitor inventory, sales, and financials. Limit resets each month; active tracked items don&apos;t count toward the next month&apos;s cap. On initial sign-up we can only track 90 days in the past and up to 50 items."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="96 Auto-Tracked Listings"
                        tooltip="Track up to 96 listings at any time. Add custom information such as purchase price, platform, etc. When this listing sells, or you move it to sold then the listing is removed from your total and you can add another listing."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="96 Manual Sales Entries /Month"
                        tooltip="Manually log sales to track them in your orders, and financials. You manage the item&apos;s status, such as moving it between inventory and orders, without automated tracking."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="96 Manual Listing Entries"
                        tooltip="Manually add up to 96 listings at any time. Add custom information such as purchase price, platform, etc. When this listing sells, or you move it to sold then the listing is removed from your total and you can add another listing."
                    />
                </li>
            </ul>

            <div className="text-black font-semibold ml-2 mb-[-6px]">
                <p>Coming Soon:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="50 AI Automated Listings"
                        tooltip="Provide a product link, and our AI will create, list, and manage 100 listings for you, tracking them through to sale."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Multi-Store Inventory Sync"
                        tooltip="Keep inventory in sync across multiple stores to avoid overselling."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Advanced AI Listing Optimization & Smart Price Adjustments"
                        tooltip="Let AI fine-tune listings and adjust prices dynamically based on market trends."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Manage up to 5 eBay Stores"
                        tooltip="Link and manage up to five eBay stores with full tracking and control."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Priority AI Processing for Faster Listings & Insights"
                        tooltip="Enjoy faster AI-driven listing creation and insights with priority processing."
                        comingSoon
                    />
                </li>
            </ul>
        </div>
    );
};

export default PlansCardProWhatsIncluded;