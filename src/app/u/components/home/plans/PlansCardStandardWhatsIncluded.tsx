import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardStandardWhatsIncluded = () => {
	const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3"

	return (
        <div className="mb-4">
            <div className="text-black font-semibold pt-2 pl-2 mb-[-6px]">
                <p>Everything in Free plus:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="100 Manually Tracked Listings"
                        tooltip="Track up to 100 listings manually per month, giving you full control over the performance of each one."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="100 Automatically Tracked Listings"
                        tooltip="Automatically track up to 100 listings per month and get real-time performance updates with ease."
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="7 Day Money Back Guarantee"
                        tooltip="Try the service risk-free with a 7-day money-back guarantee."
                    />
                </li>
            </ul>

            <div className="text-black font-semibold ml-2 mb-[-6px]">
                <p>Coming Soon:</p>
            </div>
            <ul className={rootClass}>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Downloadable Financial Reports"
                        tooltip="Access downloadable reports of your financial data for easy offline analysis."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Shipping & Fulfillment"
                        tooltip="Streamline your shipping process with integrated shipping and fulfillment management."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="Income Statement"
                        tooltip="Generate detailed income statements to track your earnings and expenses."
                        comingSoon
                    />
                </li>
                <li className="w-full">
                    <PlansClickableBulletPoint
                        text="View & Send Messages to Buyers"
                        tooltip="Communicate directly with buyers by viewing and sending messages within the platform."
                        comingSoon
                    />
                </li>
            </ul>
        </div>

	);
};

export default PlansCardStandardWhatsIncluded;
