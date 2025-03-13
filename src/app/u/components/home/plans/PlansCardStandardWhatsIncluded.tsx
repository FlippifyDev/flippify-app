import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardStandardWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3"

	return (
		<div className="mb-4">
			<div className="text-black font-semibold pt-2 pl-2 mb-[-6px]">
				<p>Features Include:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="All Deal-Finding Bots"
						tooltip="Get access to all our deal-finding bots, which continuously scan hundreds of websites and thousands of products. They automatically filter and deliver the most profitable opportunities directly to you, saving you time and maximizing your reselling potential."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Restock Monitors"
						tooltip="Stay ahead of the game with real-time alerts for high-demand product restocks. Be the first to secure items and maximize your profits with unbeatable resale opportunities."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Exclusive Reselling Inner Circle"
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
						text="20 Manually Tracked Sales/month"
						tooltip="Manually track up to 20 sales per month by entering them once into our system. From there, all data is automatically synced across your financial reports and inventory management, giving you complete oversight without repeated entry."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Financial Hub (Manual)"
						tooltip="Once you&apos;ve entered your sales, the Financial Hub automatically compiles detailed financial reports. Track profits, expenses, and overall business performance with deep insights, helping you stay on top of your financial health."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Inventory & Order Management (Manual)"
						tooltip="After entering your sales, our system automatically updates your inventory and order management. Track stock levels, sales status, and fulfillment details in one place, providing you with a comprehensive view of your reselling operations."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="&apos;Welcome to Flippify&apos; Course"
						tooltip="Get started with our comprehensive &apos;Welcome to Flippify&apos; course, which covers everything from the basics of reselling to using all of our tools. Designed for everyone, this course ensures you&apos;ll make the most out of our service and start reselling with confidence."
						comingSoon
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardStandardWhatsIncluded;
