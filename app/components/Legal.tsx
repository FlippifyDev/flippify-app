"use client"

import React, { useState } from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

const Legal = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(true);

  const togglePrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };

  const toggleTermsAndConditions = () => {
    setShowPrivacyPolicy(false);
  };

  return (
    <div className="bg-black bg-opacity-70 rounded-xl p-4 mx-2 mt-2">
      <ul className="flex">
        <li className="mr-4">
          <button
            className="text-white hover:underline"
            onClick={togglePrivacyPolicy}
          >
            Privacy Policy
          </button>
        </li>
        <li className="ml-1">
          <button
            className="text-white hover:underline"
            onClick={toggleTermsAndConditions}
          >
            Terms and Conditions
          </button>
        </li>
      </ul>
      <div className="mt-4">
        {showPrivacyPolicy ? <PrivacyPolicy /> : <TermsAndConditions />}
      </div>
    </div>
  );
};

export default Legal;

/* 
  <ul className="menu menu-vertical lg:menu-vertical bg-base-100 bg-opacity-90 rounded-box border">
    <li className="relative">
      <details className="dropdown">
        <summary className="btn">Privacy Policy</summary>
        <div className="menu dropdown-content bg-base-100 bg-opacity-90 rounded-box z-[1] w-full max-w-[80vw] lg:max-w-screen-md p-1 shadow border absolute right-0 lg:left-0 lg:right-auto max-h-60vh overflow-y-auto">
          <PrivacyPolicy />
        </div>
      </details>
    </li>
    <li className="relative">
      <details className="dropdown">
        <summary className="btn m-1">Terms and Conditions</summary>
        <div className="menu dropdown-content bg-base-100 bg-opacity-90 rounded-box z-[1] w-full max-w-[80vw] lg:max-w-screen-md p-1 shadow border absolute right-0 lg:left-0 lg:right-auto max-h-60vh overflow-y-auto">
          <TermsAndConditions />
        </div>
      </details>
    </li>
  </ul>
*/