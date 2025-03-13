"use client";

import EBayServices from "./ServicesTabEBay";
import AmazonServices from "./ServicesTabAmazon";
import ShopifyServices from "./ServicesTabShopify";
import { useState, ChangeEvent } from "react";
import React from "react";
import "@/src/styles/services-slider.css"


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
				<label className={`tab w-28 flex items-center justify-center relative ${activeTab === 'shopify' ? 'tab-active' : 'tab-inactive'}`}>
					<input
						type="radio"
						name="tabs"
						value="shopify"
						checked={activeTab === 'shopify'}
						onChange={handleTabChange}
						className="hidden"
					/>
					<span className="text-white text-lg font-medium tab-active-indicator">Shopify</span>
				</label>
				<label className={`tab w-28 flex items-center justify-center relative ${activeTab === 'amazon' ? 'tab-active' : 'tab-inactive'}`}>
					<input
						type="radio"
						name="tabs"
						value="amazon"
						checked={activeTab === 'amazon'}
						onChange={handleTabChange}
						className="hidden"
					/>
					<span className="text-white text-lg font-medium tab-active-indicator">Amazon</span>
				</label>
			</div>

			{/* Sliding Content with Fade Transition */}
			<div className={`w-full flex justify-center transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
				{activeTab === 'eBay' && <EBayServices />}
				{activeTab === 'shopify' && <ShopifyServices />}
				{activeTab === 'amazon' && <AmazonServices />}
			</div>
		</div>
	);
};

export default ServicesPage;
