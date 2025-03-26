"use client"

import React, { useState } from "react";
import Attributions from "./Attributions";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

const LegalContent = () => {
    const [activeTab, setActiveTab] = useState("privacy");

    const togglePrivacyPolicy = () => {
        setActiveTab("privacy");
    };

    const toggleTermsAndConditions = () => {
        setActiveTab("terms");
    };

    const toggleAttributions = () => {
        setActiveTab("attributions");
    };

    return (
        <div className="bg-black bg-opacity-70 rounded-xl p-4 mx-2 mt-2">
            <ul className="flex">
                <li className="mr-4">
                    <button
                        className={`text-white hover:underline ${activeTab === "privacy" ? "underline" : ""
                            }`}
                        onClick={togglePrivacyPolicy}
                    >
                        Privacy Policy
                    </button>
                </li>
                <li className="ml-1 mr-4">
                    <button
                        className={`text-white hover:underline ${activeTab === "terms" ? "underline" : ""
                            }`}
                        onClick={toggleTermsAndConditions}
                    >
                        Terms and Conditions
                    </button>
                </li>
                <li className="ml-1">
                    <button
                        className={`text-white hover:underline ${activeTab === "attributions" ? "underline" : ""
                            }`}
                        onClick={toggleAttributions}
                    >
                        Attributions
                    </button>
                </li>
            </ul>
            <div className="mt-4">
                {activeTab === "privacy" && <PrivacyPolicy />}
                {activeTab === "terms" && <TermsAndConditions />}
                {activeTab === "attributions" && <Attributions />}
            </div>
        </div>
    );
};

export default LegalContent;