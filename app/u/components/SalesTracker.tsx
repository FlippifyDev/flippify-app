"use client";

import React, { useState } from "react";
import { Lato, Inter } from "next/font/google";
import AddPurchase from "./AddPurchase";
import AddSale from "./AddSale";
import ReviewProfits from "./ReviewProfits";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const SalesTracker = () => {
    const [activeComponent, setActiveComponent] = useState('AddPurchase');

    const toggleAddPurchase = () => {
        setActiveComponent('AddPurchase');
    };

    const toggleAddSale = () => {
        setActiveComponent('AddSale');
    };

    const toggleReviewProfits = () => {
        setActiveComponent('ReviewProfits');
    };

    return (
        <div role="tablist" className="bg-userPageLightBlueBg rounded-2xl p-1 mx-2 mt-2">
            <div className="flex bg-userPageLightBlueBg rounded-t-2xl">
                <a
                    role="tab"
                    className={`px-4 py-2 rounded-t-xl transition-colors duration-100 ${activeComponent === 'AddPurchase' ? 'bg-base-100 text-white' : 'bg-base-100 bg-opacity-80 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    onClick={toggleAddPurchase}
                >
                    Add Purchase
                </a>
                <a
                    role="tab"
                    className={`px-4 py-2 rounded-t-xl transition-colors duration-100 ${activeComponent === 'AddSale' ? 'bg-base-100 text-white' : 'bg-base-100 bg-opacity-80 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    onClick={toggleAddSale}
                >
                    Add Sale
                </a>
                <a
                    role="tab"
                    className={`px-4 py-2 rounded-t-xl transition-colors duration-100 ${activeComponent === 'ReviewProfits' ? 'bg-base-100 text-white' : 'bg-base-100 bg-opacity-80 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    onClick={toggleReviewProfits}
                >
                    Review Profits
                </a>
            </div>
            <div className="bg-base-100 p-4 rounded-b-xl">
                {activeComponent === 'AddPurchase' && <AddPurchase />}
                {activeComponent === 'AddSale' && <AddSale />}
                {activeComponent === 'ReviewProfits' && <ReviewProfits />}
            </div>
        </div>
    )
}

export default SalesTracker;
