import React from "react";
import ClickableBulletPoint from "./PlansClickableBulletPoint"; // Ensure the correct import path

interface Props {
  specialPlan?: boolean;
}

const PlansCardStandardWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = specialPlan !== true ? 
    "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3": 
    "flex flex-col items-start text-white pt-6 pb-6 pl-2 gap-3";

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>Features Include:</p>
      </div>
      <div className={rootClass}>
        <ClickableBulletPoint
          text="All Deal-Finding Bots"
          tooltip="Get access to all available deal-finding bots that continuously scan the market for opportunities."
        />
        <ClickableBulletPoint
          text="Exclusive Reselling Inner Circle"
          tooltip="Join a community of top resellers and get insider tips and tricks."
        />
      </div>

      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <div className={rootClass}>
        <ClickableBulletPoint
          text="20 Manually Tracked Sales/month"
          tooltip="Track your top 20 sales manually with our advanced tracking tools."
          comingSoon // Mark as coming soon
        />
        <ClickableBulletPoint
          text="Financial Hub (Manual)"
          tooltip="Keep track of all financial transactions manually in our Financial Hub."
          comingSoon // Mark as coming soon
        />
        <ClickableBulletPoint
          text="Inventory & Order Management (Manual)"
          tooltip="Manage your inventory and orders manually with advanced features."
          comingSoon // Mark as coming soon
        />
        <ClickableBulletPoint
          text="'Welcome to Flippify' Course"
          tooltip="Learn everything you need to know with our 'Welcome to Flippify' course."
          comingSoon // Mark as coming soon
        />
      </div>
    </div>
  );
};

export default PlansCardStandardWhatsIncluded;
