"use client";

import ProductList from "./ProductList";
import ToolList from "./ToolList";

import { useState, ChangeEvent } from "react";
import React from "react";

const ProductContent = () => {
  const [activeTab, setActiveTab] = useState("bots");

  const handleTabChange = (event: ChangeEvent<HTMLInputElement>) => {
    setActiveTab(event.target.value);
  };
  return (
    <div className='w-full flex flex-col items-center'>
      <div role="tablist" className="tabs tabs-bordered w-auto flex justify-center mb-4">
        <label className={`tab ${activeTab === 'bots' ? 'tab-active text-white text-lg' : 'text-white text-lg'}`}>
          <input
            type="radio"
            name="tabs"
            value="bots"
            checked={activeTab === 'bots'}
            onChange={handleTabChange}
            className="hidden"
          />
          Bots
        </label>
        <label className={`tab ${activeTab === 'tools' ? 'tab-active text-white text-lg' : 'text-white text-lg'}`}>
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
        {activeTab === 'bots' && <ProductList />}
        {activeTab === 'tools' && <ToolList />}
      </div>
    </div>
  );
};

export default ProductContent;