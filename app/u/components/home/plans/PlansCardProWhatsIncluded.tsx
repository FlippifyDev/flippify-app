import React from "react";
import { SiTicktick } from "react-icons/si";

interface Props {
  specialPlan?: boolean
}

const PlansCardStandardWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = specialPlan !== true ? 
  "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3": 
  "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3"

  const iconClass = "col-span-1 inline-block mr-3 text-houseBlue text-sm"
  const comingSoonIconClass = "col-span-1 inline-block mr-3 text-grey-200 text-sm"


  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>
          Everything in Standard, plus:
        </p>
        </div>
        <div className={rootClass}>
          <div className="grid grid-cols-12 mb-2 items-center">
            <SiTicktick className={iconClass} />
            <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
              Priority Support
            </p>
          </div>
          <div className="grid grid-cols-12 mb-2 items-center">
            <SiTicktick className={iconClass} />
            <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
              Auto CSV Data Export
            </p>
          </div>
        </div>
      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>
          Coming Soon:
        </p>
      </div>
      <div className={rootClass}>
        <div className="grid grid-cols-12 mb-2 items-center justify-start">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            eBay Account Connection
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center justify-start">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Unlimited AI Automated Sales
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Financial Hub Automation
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            In-Store Monitors (Tesco, Nike Outlet...)
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Reseller News
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansCardStandardWhatsIncluded;
