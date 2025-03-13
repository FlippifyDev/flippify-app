	import React from "react";
	import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
	import Image from 'next/image';
	import { FaListCheck, FaMapLocationDot } from "react-icons/fa6";
	import { MdAutoAwesome, MdLocalShipping  } from "react-icons/md";


	const HomeShowcase: React.FC = () => {
		return (
			<BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem] gap-6 p-8 py-10 h-full">
				{items.map((item, i) => (
					<BentoGridItem
						key={i}
						title={item.title}
						description={item.description}
						header={item.header}
						className={`h-full flex flex-col justify-between ${item.className} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`} // Added default shadow
						icon={item.icon}
					/>
				))}
			</BentoGrid>
		);
	};

	const items = [
		{
			title: "AI-Powered Reselling",
			description: "Flippify's AI transforms the way you resell by automating every step of the process. From listing creation and pricing adjustments to inventory tracking and fulfillment, our intelligent system does the heavy lifting—so you only need to focus on sourcing and shipping.",
			header: (
				<div className="w-full h-full flex items-start justify-center">
					<Image
						src="/AutomatedResellingShowcaseLong.png"
						alt="AI-Powered Reselling"
						width={530}
						height={145}
						className="object-contain rounded-lg shadow-lg"
					/>
				</div>
			),
			className: "md:col-span-2",
			icon: <MdAutoAwesome className="h-4 w-4 text-houseBlue" />,
		},
		{
			title: "Advanced Financial Insights",
			description: "Stay ahead with real-time financial tracking powered by AI. Instantly see your total revenue, expenses, and profit margins, while intelligent analytics highlight trends and suggest strategies to optimize your business.",
			header: (
				<div className="w-full h-full flex items-start justify-center">
					<Image
						src="/FinancialTrackingShowcaseShort.png"
						alt="Advanced Financial Insights"
						width={230}
						height={145}
						className="object-contain rounded-lg shadow-lg"
					/>
				</div>
			),
			className: "md:col-span-1",
			icon: <FaMapLocationDot className="h-4 w-4 text-houseBlue" />,
		},
		{
			title: "AI-Driven Smart Listings",
			description: "Say goodbye to manual listing creation. Our AI scans product pages, extracts the best details, and crafts high-converting listings with optimized descriptions, pricing, and keywords—so you can sell faster with minimal effort.",
			header: (
				<div className="w-full h-full flex items-start justify-center">
					<Image
						src="/AutoListingShowcaseShort.png"
						alt="AI-Driven Smart Listings"
						width={230}
						height={145}
						className="object-contain rounded-lg shadow-lg"
					/>
				</div>
			),
			className: "md:col-span-1",
			icon: <FaListCheck className="h-4 w-4 text-houseBlue" />,
		},
		{
			title: "Automated Order & Shipping Management",
			description: "Shipping has never been easier. With one click, Flippify generates shipping labels, syncs tracking with eBay, and selects the best courier options—all automatically. Just print, pack, and ship while AI handles the rest.",
			header: (
				<div className="w-full h-full flex items-start justify-center">
					<Image
						src="/OrderAutomationShowcaseLong.png"
						alt="Automated Order & Shipping Management"
						width={530}
						height={145}
						className="object-contain rounded-lg shadow-lg"
					/>
				</div>
			),
			className: "md:col-span-2",
			icon: <MdLocalShipping className="h-4 w-4 text-houseBlue" />,
		},
	];

	export default HomeShowcase;
