"use client";

import React, { useState } from "react";
import { Lato, Inter } from "next/font/google";
import AddPurchase from "./AddPurchase";
import AddSale from "./AddSale";
import ReviewProfits from "./ReviewProfits";
import EstimateProfits from "./EstimateProfits";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const SalesTracker = () => {
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
    <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 w-full rounded-2xl p-1mx-2 mt-2">
      <div className={`col-span-${activeComponent === "AddPurchase" ? "1" : "2"}`}>
        <div role="tablist" className="flex rounded-t-2xl">
          <a
            role="tab"
            className={`px-4 py-2 rounded-t-xl transition-colors duration-200 ${
              activeComponent === "AddPurchase"
                ? "bg-base-100 bg-opacity-90 text-white"
                : "bg-base-100 bg-opacity-70 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={toggleAddPurchase}
          >
            Add Purchase
          </a>
          <a
            role="tab"
            className={`px-4 py-2 rounded-t-xl transition-colors duration-200 ${
              activeComponent === "AddSale"
                ? "bg-base-100 bg-opacity-90 text-white"
                : "bg-base-100 bg-opacity-70 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={toggleAddSale}
          >
            Add Sale
          </a>
          <a
            role="tab"
            className={`px-4 py-2 rounded-t-xl transition-colors duration-200 ${
              activeComponent === "ReviewProfits"
                ? "bg-base-100 bg-opacity-90 text-white"
                : "bg-base-100 bg-opacity-70 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={toggleReviewProfits}
          >
            Review Profits
          </a>
        </div>
        <div className="bg-base-100 bg-opacity-90 p-4 rounded-b-xl">
          {activeComponent === "AddPurchase" && <AddPurchase />}
          {activeComponent === "AddSale" && <AddSale />}
          {activeComponent === "ReviewProfits" && <ReviewProfits />}
        </div>
      </div>
      {activeComponent === "AddPurchase" && (
        <div>
          <div role="tablist" className="flex rounded-t-2xl pt-2 md:pt-0">
            <a
              role="tab"
              className="bg-base-100 bg-opacity-90 text-white px-4 py-2 rounded-t-xl transition-colors duration-200"
            >
              Calculate Profits
            </a>
          </div>
          <div className="bg-base-100 bg-opacity-90 p-4 rounded-b-xl col-span-1">
            <EstimateProfits />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTracker;
