import React from "react";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

const Legal = () => {
  return (
    <ul className="menu menu-vertical lg:menu-vertical bg-base-100 bg-opacity-90 rounded-box border">
      <li className="relative">
        <details className="dropdown">
          <summary className="btn">Privacy Policy</summary>
          <div className="menu dropdown-content bg-base-100 bg-opacity-90 rounded-box z-[1] w-[80vw] max-w-full lg:max-w-screen-md p-1 shadow border absolute right-full lg:left-0 lg:right-auto">
            <PrivacyPolicy />
          </div>
        </details>
      </li>
      <li className="relative">
        <details className="dropdown">
          <summary className="btn m-1">Terms and Conditions</summary>
          <div className="menu dropdown-content bg-base-100 bg-opacity-90 rounded-box z-[1] w-[80vw] max-w-full lg:max-w-screen-md p-1x shadow border absolute right-full lg:left-0 lg:right-auto">
            <TermsAndConditions />
          </div>
        </details>
      </li>
    </ul>
  );
};  

export default Legal;
