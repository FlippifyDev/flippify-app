"use client";

import ProductList from "./ProductsTabBots";
import ToolList from "./ProductsTabTools";

import { useState, ChangeEvent } from "react";
import React from "react";

const ProductContent = () => {
  const [activeTab, setActiveTab] = useState("monitors");

  const handleTabChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveTab(event.target.value);
  };
  return (
    <div className='w-full flex flex-col items-center'>
      <div role="tablist" className="tabs tabs-bordered w-auto flex justify-center mb-4">
        <label className={`tab ${activeTab === 'monitors' ? 'tab-active text-white text-lg' : 'text-white text-lg'} w-28 flex items-center justify-center`}>
          <input
            type="radio"
            name="tabs"
            value="monitors"
            checked={activeTab === 'monitors'}
            onChange={handleTabChange}
            className="hidden"
          />
          Monitors
        </label>
        <label className={`tab ${activeTab === 'tools' ? 'tab-active text-white text-lg' : 'text-white text-lg'} w-28 flex items-center justify-center`}>
          <input
            type="radio"
            name="tabs"
            value="tools"
            checked={activeTab === 'tools'}
            onChange={handleTabChange}
            className="hidden"
          />
          Tools
        </label>
      </div>

      <div className='w-full flex justify-center'>
        {activeTab === 'monitors' && <ProductList />}
        {activeTab === 'tools' && <ToolList />}
      </div>
    </div>
  );
};

export default ProductContent;