import React from "react";
import { SiTicktick } from "react-icons/si";

interface Props {
  specialPlan?: boolean;
}

const PlansCardPremiumWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass =
    specialPlan !== true
      ? "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3"
      : "flex flex-col items-start text-white pt-6 pb-6 pl-2 gap-3";

  const iconClass = "col-span-1 inline-block mr-3 text-houseBlue text-sm";
  const comingSoonIconClass =
    "col-span-1 inline-block mr-3 text-grey-200 text-sm";

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>Everything in Pro, plus:</p>
      </div>
      <div className={rootClass}>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            1-on-1 Onboarding Call
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Weekly 1-on-1 Calls
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            VIP Community Access
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Beta Access to New Features
          </p>
        </div>
      </div>
      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>Coming Soon:</p>
      </div>
      <div className={rootClass}>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Amazon Account Connection
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left text-md">
            Exclusive Limited Deals
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansCardPremiumWhatsIncluded;
