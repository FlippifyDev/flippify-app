"use client";

import ProductList from "./ServicesTabBots";
import ToolList from "./ServicesTabTools";
import { useState, ChangeEvent } from "react";
import React from "react";
import "@/styles/services-slider.css"; // Import the CSS for slider

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("monitors");

  const handleTabChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveTab(event.target.value);
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

      {/* Static Content */}
      <div className="w-full flex justify-center">
        {activeTab === "monitors" ? <ProductList /> : <ToolList />}
      </div>
    </div>
  );
};

export default ServicesPage;
