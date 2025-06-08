import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint";


interface Props {
    listings: number;
}
const PlansCardEnterpriseWhatsIncluded: React.FC<Props> = ({ listings }) => {
    const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

    return (
        <div className="mb-4">
            <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
                <p>Everything in Pro, plus:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text={`${listings} Auto-Tracked Sales /Month`}
                        tooltip={`Track up to ${listings} new eBay sales monthly. Automatically monitor inventory, sales, and financials. Limit resets each month; active tracked items don&apos;t count toward the next month&apos;s cap. On initial sign-up we can only track 90 days in the past and up to 50 items.`}
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text={`${listings} Auto-Tracked Listings`}
                        tooltip={`Track up to ${listings} listings at any time. Add custom information such as purchase price, platform, etc. When this listing sells, or you move it to sold then the listing is removed from your total and you can add another listing.`}
                    />
                </li>
            </ul>
        </div>
    );
};

export default PlansCardEnterpriseWhatsIncluded;
