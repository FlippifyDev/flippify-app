import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint"; 


const PlansCardFreeWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

	return (
        <div className="mb-4">
            <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
                <p>Features Include:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="20 Manually Tracked Listings"
                        tooltip="Track up to 20 listings manually per month to keep a close eye on your products and performance."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="10 Automatically Tracked Listings"
                        tooltip="Automatically track up to 10 listings per month and get real-time updates on their status and performance."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Financial Hub"
                        tooltip="Access all your financial information in one place, including earnings and transactions."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Inventory & Orders"
                        tooltip="Manage your inventory and orders easily with detailed tracking and reporting tools."
                    />
                </li>
            </ul>
            <div className="text-black font-semibold ml-2 mb-[-6px]">
                <p>Coming Soon:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Listings Manager"
                        tooltip="A tool to help you organize and manage your product listings efficiently."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="eBay Account Management"
                        tooltip="Manage and synchronize your eBay account directly from this platform."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Activity Log"
                        tooltip="View all recent activity on your eBay account to stay informed and up-to-date."
                        comingSoon
                    />
                </li>
            </ul>
        </div>
	);
};

export default PlansCardFreeWhatsIncluded;
