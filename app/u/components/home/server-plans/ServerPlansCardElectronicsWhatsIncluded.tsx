import React from "react";
import PlansClickableBulletPoint from "../plans/PlansClickableBulletPoint";

const ServerPlansCardElectronicsWhatsIncluded = () => {
  const rootClass = "flex flex-col items-start text-white pt-6 pb-6 pl-2 gap-3"; // Special plan styling for white text

  return (
    <div className="mb-4">
      <ul className={rootClass}>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Automated eBay Price Comparison"
            tooltip="Automatically compare eBay prices for electronic products."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Monitoring Across Thousands of Products"
            tooltip="Monitor thousands of electronic products for price changes."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="High-Precision Profit Potential Alerts"
            tooltip="Receive precise alerts on high-profit potential electronics."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Dedicated UK Marketplace Focus"
            tooltip="Focus on the UK marketplace for electronics."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Regular Alerts on Electronics Deals"
            tooltip="Get frequent updates and alerts on the latest electronics deals."
          />
        </li>
      </ul>
    </div>
  );
};

export default ServerPlansCardElectronicsWhatsIncluded;
