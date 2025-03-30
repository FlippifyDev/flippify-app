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
                        text="Unlimited eBay Store Connections"
                        tooltip="Receive a personalized 1-on-1 onboarding session. You&apos;ll get expert guidance on how to maximize your experience with our tools and services."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Dedicated AI-Powered Business Insights & Forecasting"
                        tooltip="Have weekly 1-on-1 calls with our experts to ensure your success and growth as a reseller."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Dedicated Account Manager & Priority Support"
                        tooltip="Be the first to try out new features in beta before they are released to the general public."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Automated Bulk Order Processing & Warehouse-Level Tracking"
                        tooltip="Be the first to try out new features in beta before they are released to the general public."
                    />
                </li>
            </ul>

            <div className="text-black font-semibold ml-2 mb-[-6px]">
                <p>Coming Soon:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Custom Multi-Platform Automation (Shopify & Amazon Early Access)"
                        tooltip="Integrate your Amazon account for full automation and seamless tracking of sales and listings."
                        comingSoon={true}
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Custom API Access & Third Party Integrations"
                        tooltip="Join an exclusive VIP community of elite resellers for networking, insider knowledge, and special events."
                        comingSoon={true}
                    />
                </li>
            </ul>
        </div>
    );
};

export default PlansCardEliteWhatsIncluded;
