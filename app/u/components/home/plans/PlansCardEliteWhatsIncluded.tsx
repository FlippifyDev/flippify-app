import React from "react";
import ClickableBulletPoint from "./PlansClickableBulletPoint"; // Correct import path for ClickableBulletPoint

interface Props {
  specialPlan?: boolean;
}

const PlansCardEliteWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3";

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>Everything in Pro, plus:</p>
      </div>
      <div className={rootClass}>
        <ClickableBulletPoint
          text="1-on-1 Onboarding Call"
          tooltip="Receive a personalized 1-on-1 onboarding session."
        />
        <ClickableBulletPoint
          text="Weekly 1-on-1 Calls"
          tooltip="Have weekly 1-on-1 calls to ensure your success."
        />
        <ClickableBulletPoint
          text="VIP Community Access"
          tooltip="Join an exclusive VIP community of elite resellers."
        />
        <ClickableBulletPoint
          text="Beta Access to New Features"
          tooltip="Be the first to try out new features in beta."
        />
      </div>

      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <div className={rootClass}>
        <ClickableBulletPoint
          text="Amazon Account Connection"
          tooltip="Integrate your Amazon account for seamless automation."
          comingSoon // Changed from "disabled" to "comingSoon"
        />
        <ClickableBulletPoint
          text="Exclusive Limited Deals"
          tooltip="Gain access to exclusive deals available only to VIP members."
          comingSoon // Changed from "disabled" to "comingSoon"
        />
      </div>
    </div>
  );
};

export default PlansCardEliteWhatsIncluded;
