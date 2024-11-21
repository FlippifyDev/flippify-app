import React from "react";
import PlansClickableBulletPoint from "../plans/PlansClickableBulletPoint";

const ServerPlansCardDealWatchWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

	return (
		<div className="mb-4">
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Advanced eBay Price Comparison"
						tooltip="Get notified only when the items is selling well and quick on eBay."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Frequent Website Scanning"
						tooltip="Frequent monitoring of several websites to find the best deals."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Instant Alerts for High-Profit Opportunities"
						tooltip="Get notified for high-profit reselling opportunities."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="UK-Focused Deal Tracking"
						tooltip="Focus on UK-based deals for resellers."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Frequent Updates on Trending Electronics Deals"
						tooltip="Stay updated with trending electronics deals."
					/>
				</li>
			</ul>
		</div>
	);
};

export default ServerPlansCardDealWatchWhatsIncluded;
