import React from "react";
import { SiTicktick } from "react-icons/si";

interface Props {
  specialPlan?: boolean
}

const PlansCardStandardWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = specialPlan !== true ? 
  "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3": 
  "flex flex-col items-start text-white pt-6 pb-6 pl-2 gap-3"

  const iconClass = specialPlan !== true ?
  "col-span-1 inline-block mr-3 text-houseBlue text-sm":
  "col-span-1 inline-block mr-3 text-houseBlue text-sm"

  return (
    <div>
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>
          Features Include:
        </p>
      </div>
      <div className={rootClass}>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left text-md">
            Deal-Finder Access
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Connect eBay & Amazon Accounts
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            AI Automated Sales (20/month)
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Auto Inventory & Order Management
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Financial Hub Automation
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            'Welcome to Flippify' Course
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Exclusive Reselling Inner Circle
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansCardStandardWhatsIncluded;
