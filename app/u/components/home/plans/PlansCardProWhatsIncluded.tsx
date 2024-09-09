import React from "react";
import ClickableBulletPoint from "./PlansClickableBulletPoint"; // Ensure the correct import path

interface Props {
  specialPlan?: boolean;
}

const PlansCardProWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = specialPlan !== true 
    ? "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3" 
    : "flex flex-col items-start text-white pt-6 pb-6 pl-2 gap-3";

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>Everything in Standard, plus:</p>
      </div>
      <div className={rootClass}>
        {/* Apply group-hover inside each individual ClickableBulletPoint */}
        <ClickableBulletPoint
          text="Priority Support"
          tooltip="Get priority access to support for all your needs."
        />
        <ClickableBulletPoint
          text="Auto CSV Data Export"
          tooltip="Easily export your data in CSV format for analysis."
        />
      </div>

      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <div className={rootClass}>
        <ClickableBulletPoint
          text="eBay Account Connection"
          tooltip="Seamlessly integrate your eBay account."
          comingSoon // Gray icon but still active
        />
        <ClickableBulletPoint
          text="Unlimited AI Automated Sales"
          tooltip="Enjoy unlimited sales automation powered by AI."
          comingSoon // Gray icon but still active
        />
        <ClickableBulletPoint
          text="Financial Hub Automation"
          tooltip="Automate your financial hub for maximum efficiency."
          comingSoon // Gray icon but still active
        />
        <ClickableBulletPoint
          text="In-Store Monitors (Tesco, Nike Outlet...)"
          tooltip="Monitor in-store stock from major outlets like Tesco and Nike."
          comingSoon // Gray icon but still active
        />
        <ClickableBulletPoint
          text="Reseller News"
          tooltip="Stay updated with the latest reseller news."
          comingSoon // Gray icon but still active
        />
      </div>
    </div>
  );
};

export default PlansCardProWhatsIncluded;
