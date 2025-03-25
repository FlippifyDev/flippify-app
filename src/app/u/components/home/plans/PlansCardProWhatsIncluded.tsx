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
						text="500 Manually Tracked Listings"
                        tooltip="Manually track up to 500 listings, allowing for detailed management and performance tracking of each listing."
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="500 Automatically Tracked Listings"
                        tooltip="Automatically track up to 500 listings, providing effortless performance monitoring and updates without manual input."
					/>
				</li>
			</ul>

			<div className="text-black font-semibold ml-2 mb-[-6px]">
				<p>Coming Soon:</p>
			</div>
			<ul className={rootClass}>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="AI Created Listings"
						tooltip="Simply insert your product URL and let our AI create the listing for you."
						comingSoon
					/>
				</li>
				<li className="w-full">
					<PlansClickableBulletPoint
						text="eBay store insights"
						tooltip="Gain valuable insights about how to improve your eBay store and increase sales."
						comingSoon
					/>
				</li>
			</ul>
		</div>
	);
};

export default PlansCardProWhatsIncluded;
