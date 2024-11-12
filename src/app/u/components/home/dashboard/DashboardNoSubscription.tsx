import DashboardNoSubscriptionButton from "./DashboardNoSubscriptionButton";
import ClickableBulletPoint from "./DashboardClickableBulletPoint";

import { Lato } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

interface DashboardNoSubscriptionProps {
	username: string;
}

const DashboardNoSubscription: React.FC<DashboardNoSubscriptionProps> = ({ username }) => {
	return (
		<div className="flex justify-center items-center h-full">
			{/* Set to full height */}
			<div className="w-full h-auto flex flex-col justify-center">
				{/* Center the content vertically */}
				<div className="text-center">
					<h2 className={`${lato.className} text-4xl text-houseBlue font-bold mb-2`}>
						Unlock Automated Profits
					</h2>
					<p className="text-gray-600 mb-4">
						You&apos;re Just One Step Away from Automated Success. Choose Your Plan Now!
					</p>
					<hr className="hr-price-stat mb-4" />
					<div className="mb-6 w-full">
						<h3 className="text-xl font-bold text-gray-700 mb-4">Why Choose Us?</h3>
						<ul className="text-left space-y-2 min-w-xl">
							{/* Adjust space between items */}
							{[
								{ text: "24/7 Automated Deal-Finding Bots", tooltip: "Our advanced bots continuously scour the web for the most profitable deals across multiple categories, including electronics, LEGO, and more. Never miss a money-making opportunity, even while you sleep." },
								{ text: "Effortless Reselling Automation", tooltip: "From sourcing to order fulfillment, we handle every aspect of the reselling process. All you need to do is confirm the purchase and ship when it sells. Spend less time on tedious tasks and more time enjoying your profits." },
								{ text: "Monetize Your Server with Deal-Finding Bots", tooltip: "Transform your Discord server into a profitable reselling hub by integrating our deal-finding bots directly into your community. As a server owner, you can offer your users the same powerful tools and live alerts that our platform provides, without the hassle of creating or maintaining bots yourself. This means your members can access the best deals around the clock, generating revenue for themselves—and for you—while you sit back and let our bots do the work. Enhance your servers value, drive engagement, and earn passive income, all while offering your community top-tier reselling capabilities." },
								{ text: "Advanced Financial Tracking & Analytics", tooltip: " Stay on top of your business with our built-in financial management tools. Track profits, expenses, and inventory effortlessly, and make data-driven decisions to boost your bottom line." },
								{ text: "Exclusive Reseller Community, Events & Expert Support", tooltip: "Become part of a thriving community of successful resellers with access to exclusive events, workshops, and giveaways. We regularly host live Q&A sessions with industry specialists, offer hands-on workshops, and conduct exciting giveaways to keep you engaged and growing. Plus, we’re continually expanding our team of experts and developing a comprehensive course designed to help both new and seasoned resellers sharpen their skills and scale their business. Whether you’re just starting out or looking to take your reselling to the next level, our community offers the tools, insights, and support you need to succeed." },
								{ text: "Continual System Enhancements", tooltip: "We regularly update our bots and tools with new features and improvements. As our service evolves, so does your advantage in the marketplace." },
								{ text: "Ad-Free, Streamlined Experience", tooltip: "Enjoy an uninterrupted, ad-free experience that allows you to focus on what matters most - growing your reselling business." },
								{ text: "Early Access to New Tools and Features", tooltip: "Be the first to try out new tools and updates. Stay ahead of the curve with features that keep you competitive in the fast-paced world of reselling." },
								{ text: "Self-Promotion and Networking Opportunities", tooltip: "Leverage our platform to promote your own services or products and connect with other like-minded entrepreneurs. Expand your reach and grow your network." }
							].map((item, index) => (
								<li key={index} className="w-full">
									<ClickableBulletPoint
										text={item.text}
										tooltip={item.tooltip}
									/>
								</li>
							))}
						</ul>
					</div>
					<div className="border-t border-gray-200 pt-6">
						<DashboardNoSubscriptionButton username={username} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardNoSubscription;