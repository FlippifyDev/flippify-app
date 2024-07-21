"use client";

import ProductList from "./ProductList";
import ToolList from "./ToolList";

import { useState } from "react";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("bots");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div role="tablist" className="tabs tabs-bordered">
      <input
        type="radio"
        name="bots"
        role="tab"
        className="tab"
        aria-label="Bots"
      />
      <div role="tabpanel" className="tab-content p-10">
        <ProductList />
      </div>

      <input
        type="radio"
        name="Tools"
        role="tab"
        className="tab"
        aria-label="Tab 2"
        defaultChecked
      />
      <div role="tabpanel" className="tab-content p-10">
        <ToolList />
      </div>
    </div>
  );
};

export default ProductTabs;

/*
    <div className='w-full border flex flex-col justify-center align-items'>
      <div role="tablist" className="tabs tabs-boxed w-72 flex justify-center space-x-4 mb-4">
        <button
          role="tab"
          className={`tab ${activeTab === 'bots' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('bots')}
        >
          Bots
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === 'tools' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('tools')}
        >
          Tools
        </button>
      </div>
      <div className='flex justify-center'>
        {activeTab === 'bots' && <ProductList />}
        {activeTab === 'tools' && <ToolList />}
      </div>
    </div>
*/
