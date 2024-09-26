import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint";

const PlansCardProWhatsIncluded = () => {
  const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>Everything in Standard, plus:</p>
      </div>
      <ul className={rootClass}>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Priority Support"
            tooltip="Get priority access to support for all your needs."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Auto CSV Data Export"
            tooltip="Easily export your data in CSV format for analysis."
          />
        </li>
      </ul>

      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <ul className={rootClass}>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="eBay Account Connection"
            tooltip="Seamlessly integrate your eBay account."
            comingSoon
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Unlimited AI Automated Sales"
            tooltip="Enjoy unlimited sales automation powered by AI."
            comingSoon
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Financial Hub Automation"
            tooltip="Automate your financial hub for maximum efficiency."
            comingSoon
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="In-Store Monitors (Tesco, Nike Outlet...)"
            tooltip="Monitor in-store stock from major outlets like Tesco and Nike."
            comingSoon
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Reseller News"
            tooltip="Stay updated with the latest reseller news."
            comingSoon
          />
        </li>
      </ul>
    </div>
  );
};

export default PlansCardProWhatsIncluded;
