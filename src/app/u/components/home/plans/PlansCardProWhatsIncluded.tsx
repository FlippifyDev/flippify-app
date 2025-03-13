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
						text="Priority Support"
						tooltip="Get prioritized support with a dedicated team ready to assist you as soon as possible. Whether it's a simple question or a complex issue, help will always be on hand."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Auto CSV Data Export"
						tooltip="Easily export all your sales data into CSV format for analysis. This allows you to seamlessly import the data into spreadsheets or other apps for deeper insights and reporting."
					/>
				</li>
			</ul>

			<div className="text-black font-semibold ml-2 mb-[-6px]">
				<p>Coming Soon:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="eBay Account Connection"
						tooltip="Connect your eBay account to Flippify, allowing us to track your sales, automatically list purchases, and handle everything in between. Say goodbye to manual entries and enjoy seamless automation."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Unlimited AI Automated Sales"
						tooltip="With unlimited automated sales, simply purchase a product our bots find, fill out some minor details, and let us do the rest. We'll automatically list your product on eBay, generate descriptions with AI, and handle the entire process. Manual entry is also available if preferred."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Financial Hub Automation"
						tooltip="Now fully automated, your Financial Hub will automatically track and log your transactions and sales once your eBay account is connected. This provides detailed financial insights and reports, maximizing efficiency."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="In-Store Monitors (Tesco, Nike Outlet...)"
						tooltip="Set your location and preferred radius, and our monitors will track stock in major retail stores like Tesco, Nike, and Costco. Get real-time updates on profitable deals available in physical stores near you."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="Reseller News"
						tooltip="Stay ahead of the competition with regular reseller news updates. Using AI, we deliver timely insights on market trends, new product drops, and opportunities, so you're always in the know."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="&apos;The Retail Goldmine&apos; Course"
						tooltip="Learn the art of reselling in-store deals and wholesale opportunities with our &apos;Retail Goldmine&apos; course. Master the use of our in-store monitors and sourcing from physical retail locations such as Tesco, Costco and Nike-Outlets."
						comingSoon
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardProWhatsIncluded;
