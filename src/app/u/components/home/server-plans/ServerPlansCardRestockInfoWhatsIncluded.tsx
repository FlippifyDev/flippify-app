import React from "react";
import PlansClickableBulletPoint from "../plans/PlansClickableBulletPoint";

const ServerPlansCardRestockInfoWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

	return (
		<div className="mb-4">
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Real-Time Restock Alerts"
						tooltip="Get instant notifications when high-demand products are restocked."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Comprehensive Product Availability Tracking"
						tooltip="Monitor multiple retailers for product availability in one place."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Customizable Alert Settings"
						tooltip="Set alerts for specific products or categories to stay ahead."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Region-Specific Stock Monitoring"
						tooltip="Track restocks for your preferred regions or countries."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Ongoing Expansion of Supported Retailers"
						tooltip="We're continuously adding more retailers to the monitoring list."
					/>
				</li>
			</ul>
		</div>
	);
};

export default ServerPlansCardRestockInfoWhatsIncluded;
