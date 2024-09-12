import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardStandardWhatsIncluded = () => {
  const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3"

  return (
    <div className="mb-4">
      <div className="text-black font-semibold pt-2 pl-2 mb-[-6px]">
        <p>Features Include:</p>
      </div>
      <ul className={rootClass}>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="All Deal-Finding Bots"
            tooltip="Get access to all available deal-finding bots that continuously scan the market for opportunities."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Exclusive Reselling Inner Circle"
            tooltip="Join a community of top resellers and get insider tips and tricks."
          />
        </li>
      </ul>

      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <ul className={rootClass}>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="20 Manually Tracked Sales/month"
            tooltip="Track your top 20 sales manually with our advanced tracking tools."
            comingSoon 
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Financial Hub (Manual)"
            tooltip="Keep track of all financial transactions manually in our Financial Hub."
            comingSoon 
          />          
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Inventory & Order Management (Manual)"
            tooltip="Manage your inventory and orders manually with advanced features."
            comingSoon 
          />          
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="'Welcome to Flippify' Course"
            tooltip="Learn everything you need to know with our 'Welcome to Flippify' course."
            comingSoon 
          />          
        </li>
      </ul>
    </div>
  );
};

export default PlansCardStandardWhatsIncluded;
