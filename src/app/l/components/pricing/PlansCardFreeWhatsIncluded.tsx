import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardFreeWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3"

	return (
		<div className="mb-4">
			<div className="text-black font-semibold pt-2 pl-2 mb-[-6px]">
				<p>Features Include:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="20 Manual Listings (Tracked & Managed)"
						tooltip="Get access to all our deal-finding bots, which continuously scan hundreds of websites and thousands of products. They automatically filter and deliver the most profitable opportunities directly to you, saving you time and maximizing your reselling potential."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Basic Inventory & Order Management"
						tooltip="Join a community of experienced, top-tier resellers and gain access to exclusive networking opportunities. Participate in live Q&A sessions, giveaways, and get access to private community spaces not available to the general public. Learn from the best and stay ahead of the competition."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Basic Financial Tracking"
						tooltip="Join a community of experienced, top-tier resellers and gain access to exclusive networking opportunities. Participate in live Q&A sessions, giveaways, and get access to private community spaces not available to the general public. Learn from the best and stay ahead of the competition."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Single eBay Store Management"
						tooltip="Join a community of experienced, top-tier resellers and gain access to exclusive networking opportunities. Participate in live Q&A sessions, giveaways, and get access to private community spaces not available to the general public. Learn from the best and stay ahead of the competition."
					/>
				</li>
			</ul>

			<div className="text-black font-semibold ml-2 mb-[-6px]">
				<p>Coming Soon:</p>
			</div>
			<ul className={rootClass}>
			<li className="w-full">
					<PlansClickableBulletPoint
						text="5 Automatic Listings (Created & Managed by AI)"
						tooltip="Stay ahead of the game with real-time alerts for high-demand product restocks. Be the first to secure items and maximize your profits with unbeatable resale opportunities."
						comingSoon
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardFreeWhatsIncluded;
