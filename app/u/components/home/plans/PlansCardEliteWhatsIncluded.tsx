import React from "react";
import PlansClickableBulletPoint from "./PlansClickableBulletPoint"; // Correct import path for ClickableBulletPoint


const PlansCardEliteWhatsIncluded = () => {
  const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>Everything in Pro, plus:</p>
      </div>
      <div className={rootClass}>
        <PlansClickableBulletPoint
          text="1-on-1 Onboarding Call"
          tooltip="Receive a personalized 1-on-1 onboarding session."
        />
        <PlansClickableBulletPoint
          text="Weekly 1-on-1 Calls"
          tooltip="Have weekly 1-on-1 calls to ensure your success."
        />
        <PlansClickableBulletPoint
          text="VIP Community Access"
          tooltip="Join an exclusive VIP community of elite resellers."
        />
        <PlansClickableBulletPoint
          text="Beta Access to New Features"
          tooltip="Be the first to try out new features in beta."
        />
      </div>

      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <div className={rootClass}>
        <PlansClickableBulletPoint
          text="Amazon Account Connection"
          tooltip="Integrate your Amazon account for seamless automation."
          comingSoon
        />
        <PlansClickableBulletPoint
          text="Exclusive Limited Deals"
          tooltip="Gain access to exclusive deals available only to VIP members."
          comingSoon
        />
      </div>
    </div>
  );
};

export default PlansCardEliteWhatsIncluded;
