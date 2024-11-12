import React from "react";
import PlansClickableBulletPoint from "../plans/PlansClickableBulletPoint";

const ServerPlansCardRetiringSetsWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

	return (
		<div className="mb-4">
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Comprehensive eBay Price Analysis"
						tooltip="Get detailed price analysis for retiring sets on eBay."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Integrated Keepa Price History Links"
						tooltip="Access Keepa links for price history and analysis."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Accurate Retirement Date Notifications"
						tooltip="Receive notifications for upcoming retirement dates of sets."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="UK-Centric Retailer Monitoring"
						tooltip="Monitor key UK-based retailers for retiring sets."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Continuous Expansion of Supported Websites"
						tooltip="We're constantly expanding our list of supported websites."
					/>
				</li>
			</ul>
		</div>
	);
};

export default ServerPlansCardRetiringSetsWhatsIncluded;
