"use client";

import ProductList from "./ServicesTabBots";
import ToolList from "./ServicesTabTools";
import { useState, ChangeEvent } from "react";
import React from "react";
import "@/src/styles/services-slider.css"


const ServicesPage = () => {
	const [activeTab, setActiveTab] = useState("monitors");
	const [fadeIn, setFadeIn] = useState(true); // To control fade effect

	const handleTabChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFadeIn(false); // Start fading out the current content
		setTimeout(() => {
			setActiveTab(event.target.value); // Change the tab after fade out is complete
			setFadeIn(true); // Start fading in the new content
		}, 300); // 300ms matches the fade-out transition
	};

	return (
		<div className="w-full flex flex-col items-center">
			{/* Tab Buttons with Sliding Indicator */}
			<div role="tablist" className="tabs w-auto flex justify-center mb-4 relative">
				<label className={`tab w-28 flex items-center justify-center relative ${activeTab === 'monitors' ? 'tab-active' : 'tab-inactive'}`}>
					<input
						type="radio"
						name="tabs"
						value="monitors"
						checked={activeTab === 'monitors'}
						onChange={handleTabChange}
						className="hidden"
					/>
					<span className="text-white text-lg font-medium tab-active-indicator">Monitors</span>
				</label>
				<label className={`tab w-28 flex items-center justify-center relative ${activeTab === 'tools' ? 'tab-active' : 'tab-inactive'}`}>
					<input
						type="radio"
						name="tabs"
						value="tools"
						checked={activeTab === 'tools'}
						onChange={handleTabChange}
						className="hidden"
					/>
					<span className="text-white text-lg font-medium tab-active-indicator">Tools</span>
				</label>
			</div>

			{/* Sliding Content with Fade Transition */}
			<div className={`w-full flex justify-center transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
				{activeTab === "monitors" ? <ProductList /> : <ToolList />}
			</div>
		</div>
	);
};

export default ServicesPage;
