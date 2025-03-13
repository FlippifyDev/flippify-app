"use client";

import EBayServices from "./ServicesTabEBay";
import ComingSoonServices from "./ServicesTabComingSoon";
import { useState, ChangeEvent } from "react";
import React from "react";
import "@/styles/services-slider.css"


const ServicesPage = () => {
	const [activeTab, setActiveTab] = useState("eBay");
	const [fadeIn, setFadeIn] = useState(true); 

	const handleTabChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFadeIn(false); 
		setTimeout(() => {
			setActiveTab(event.target.value); 
			setFadeIn(true); 
		}, 300); 
	};

	return (
		<div className="w-full flex flex-col items-center">
			{/* Tab Buttons with Sliding Indicator */}
			<div role="tablist" className="tabs w-auto flex justify-center mb-4 relative">
				<label className={`tab w-28 flex items-center justify-center relative ${activeTab === 'eBay' ? 'tab-active' : 'tab-inactive'}`}>
					<input
						type="radio"
						name="tabs"
						value="eBay"
						checked={activeTab === 'eBay'}
						onChange={handleTabChange}
						className="hidden"
					/>
					<span className="text-white text-lg font-medium tab-active-indicator">eBay</span>
				</label>
				<label className={`tab w-full flex items-center justify-center relative ${activeTab === 'comingSoon' ? 'tab-active' : 'tab-inactive'}`}>
					<input
						type="radio"
						name="tabs"
						value="comingSoon"
						checked={activeTab === 'shopify'}
						onChange={handleTabChange}
						className="hidden"
					/>
					<span className="text-white text-lg font-medium tab-active-indicator">Coming Soon</span>
				</label>
			</div>

			<div className={`w-full flex justify-center transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
					{activeTab === 'eBay' ? <EBayServices /> : null}
					{activeTab === 'comingSoon' ? <ComingSoonServices /> : null}
			</div>
		</div>
	);
};

export default ServicesPage;
