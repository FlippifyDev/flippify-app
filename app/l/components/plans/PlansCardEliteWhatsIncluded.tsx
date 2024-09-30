import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint"; // Correct import path for ClickableBulletPoint


const PlansCardEliteWhatsIncluded = () => {
  const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>Everything in Pro, plus:</p>
      </div>
      <ul className={rootClass}>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="1-on-1 Onboarding Call"
            tooltip="Receive a personalized 1-on-1 onboarding session. You&apos;ll get expert guidance on how to maximize your experience with our tools and services."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Weekly 1-on-1 Calls"
            tooltip="Have weekly 1-on-1 calls with our experts to ensure your success and growth as a reseller."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="VIP Community Access"
            tooltip="Join an exclusive VIP community of elite resellers for networking, insider knowledge, and special events."
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Beta Access to New Features"
            tooltip="Be the first to try out new features in beta before they are released to the general public."
          />
        </li>
      </ul>
      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <ul className={rootClass}>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Amazon Account Connection"
            tooltip="Integrate your Amazon account for full automation and seamless tracking of sales and listings."
            comingSoon
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="Exclusive Limited Deals"
            tooltip="Gain access to exclusive, limited-time deals available only to VIP members."
            comingSoon
          />
        </li>
        <li className="w-full">
          <PlansClickableBulletPoint
            text="&apos;The Art of Reselling&apos; Course"
            tooltip="Master expert reselling techniques with our &apos;Art of Reselling&apos; course. Learn how to dominate the online market with advanced strategies and insider tips."
            comingSoon
          />
        </li>
      </ul>
    </div>
  );
};

export default PlansCardEliteWhatsIncluded;
