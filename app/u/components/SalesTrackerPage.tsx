"use client";

import SalesTrackerTabCalcProfits from "./SalesTrackerTabCalcProfits";
import SalesTrackerTabAddPurchase from "./SalesTrackerTabAddPurchase";
import SalesTrackerReviewProfits from "./SalesTrackerReviewProfits";
import SalesTrackerTabAddSale from "./SalesTrackerTabAddSale";

import React, { useState } from "react";


const SalesTrackerPage = () => {
  const [activeComponent, setActiveComponent] = useState("AddPurchase");

  const toggleAddPurchase = () => {
    setActiveComponent("AddPurchase");
  };

  const toggleAddSale = () => {
    setActiveComponent("AddSale");
  };

  const toggleReviewProfits = () => {
    setActiveComponent("ReviewProfits");
  };

  return (
    <div className="bg-lightGreyBackground grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 w-full rounded-2xl p-1mx-2 mt-2">
      <div className={`col-span-${activeComponent === "AddPurchase" ? "1" : "2"}`}>
        <div role="tablist" className="bg-lightGreyBackground flex rounded-t-2xl">
          <a
            role="tab"
            className={`bg-white px-4 py-2 rounded-t-xl transition-colors duration-200 select-none ${
              activeComponent === "AddPurchase"
                ? "bg-base-100 bg-opacity-90 text-lightModeText"
                : "bg-base-100 bg-opacity-70 text-lightModeText hover:bg-gray-100"
            }`}
            onClick={toggleAddPurchase}
          >
            Add Purchase
          </a>
          <a
            role="tab"
            className={`bg-white px-4 py-2 rounded-t-xl transition-colors duration-200 select-none ${
              activeComponent === "AddSale"
                ? "bg-base-100 bg-opacity-90 text-lightModeText"
                : "bg-base-100 bg-opacity-70 text-lightModeText hover:bg-gray-100"
            }`}
            onClick={toggleAddSale}
          >
            Add Sale
          </a>
          <a
            role="tab"
            className={`bg-white px-4 py-2 rounded-t-xl transition-colors duration-200 select-none ${
              activeComponent === "ReviewProfits"
                ? "bg-base-100 bg-opacity-90 text-lightModeText"
                : "bg-base-100 bg-opacity-70 text-lightModeText hover:bg-gray-100"
            }`}
            onClick={toggleReviewProfits}
          >
            Review Profits
          </a>
        </div>
        <div className="bg-white bg-opacity-90 p-4 rounded-b-xl h-full">
          {activeComponent === "AddPurchase" && <SalesTrackerTabAddPurchase />}
          {activeComponent === "AddSale" && <SalesTrackerTabAddSale />}
          {activeComponent === "ReviewProfits" && <SalesTrackerReviewProfits />}
        </div>
      </div>
      {activeComponent === "AddPurchase" && (
        <div>
          <div role="tablist" className="flex bg-lightGreyBackground rounded-t-2xl pt-2 md:pt-0">
            <a
              role="tab"
              className="text-lightModeText bg-white px-4 py-2 rounded-t-xl transition-colors duration-200 select-none"
            >
              Calculate Profits
            </a>
          </div>
          <div className="bg-white bg-opacity-90 p-4 rounded-b-xl col-span-1 h-full">
            <SalesTrackerTabCalcProfits />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTrackerPage;