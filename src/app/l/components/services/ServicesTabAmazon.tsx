import ServicesToolsCard from "./ServicesToolsCard";
import { Lato, Inter } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const AmazonServices: React.FC = () => {
	return (
		<div className="flex flex-col justify-center xl:w-11/12 h-full mb-5 mt-5">
			<div className="flex flex-col items-center space-y-3 text-center mb-5">
				<div className="flex justify-center mx-2">
					<p
						className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}
					>
						Tools
						<a
							className={`${inter.className} mb-8 text-white text-5xl font-bold`}
						>
							{/* This is a space */} Selection
						</a>
					</p>
				</div>
				<div className="flex justify-center max-w-2xl">
					<p className="mx-4 sm:mx-2 text-white text-md sm:text-lg text-center">
						Uncover a handpicked collection of tools designed to simplify tasks and improve workflow efficiency, ensuring you stay ahead in today&apos;s competitive market.
					</p>
				</div>
			</div>
			<div className="flex flex-wrap justify-center ">
				<ServicesToolsCard
					title="Auto Deal Finding"
					description="Discover unbeatable sales with our Smart Deal Finder! Our bots do all the hard work for you, constantly searching thousands of products over hundreds of websites. Our monitors provides real-time updates and detailed comparisons to help you find the best deals available."
					disclaimer={null}
					image="https://i.imgur.com/uXqxOZm.png"
				/>
				<ServicesToolsCard
					title="Inventory Tracking"
					description="Keep full control of your reselling operation with our automated inventory tracker. Monitor your stock levels, current orders, past sales, and purchase history to make informed decisions and streamline your business operations."
					disclaimer={null}
					image="https://i.imgur.com/vNFMFBR.png"
				/>
				<ServicesToolsCard
					title="Financial Hub"
					description="Manage your reselling profits and expenses with ease using our Financial Hub. Track your earnings, costs, and generate detailed financial reports, including tax summaries, to keep your business financially organized."
					disclaimer={null}
					image="https://i.imgur.com/r5viQMS.png"
				/>
				<ServicesToolsCard
					title="Store Automation"
					description="Automate your entire reselling process from product listings to order fulfillment. With integrated tools for eBay and Amazon, our system manages your store&apos;s operations, so you can focus on scaling your business."
					disclaimer={null}
					image="https://i.imgur.com/hnTZgcx.png"
				/>
				<ServicesToolsCard
					title="Reseller News"
					description="Stay ahead of the competition with real-time updates and insights from the reselling world. Our Reseller News keeps you informed about market trends, product releases, and exclusive deals that can boost your profits."
					disclaimer={null}
					image="https://i.imgur.com/IwQsPG4.png"
				/>
				<ServicesToolsCard
					title="Masterclass Courses"
					description="Level up your reselling expertise with our in-depth Masterclass courses. Designed for beginners and experts alike, these courses provide extremely valuable insights and strategies that can be utilized no matter what, including the ins-and-outs of our systems."
					disclaimer={null}
					image="https://i.imgur.com/G5FcJf4.png"
				/>
				<ServicesToolsCard
					title="In-Store Monitors"
					description="Get real-time updates on in-store stock from major retailers like Tesco, Nike Outlets, Costco, and more. Our in-store monitors track inventory levels, helping you spot local deals that can be resold quickly for a profit & in bulk."
					disclaimer={null}
					image="https://i.imgur.com/wWTl7Yd.png"
				/>
				<ServicesToolsCard
					title="Exclusive Inner-Circle"
					description="Join our Exclusive Inner-Circle in the Discord Community for insider access to advanced tools, expert advice, and a supportive community of top-tier resellers. Collaborate, learn, and take your reselling business to the next level."
					disclaimer={null}
					image="https://i.imgur.com/EPRnIHa.png"
				/>
			</div>
		</div>
	);
};

export default AmazonServices;
