import React from "react";
import { TbPointFilled } from "react-icons/tb";

interface Props {
  specialPlan?: boolean
}

const PlansCardPremiumWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = specialPlan !== true ? 
  "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3": 
  "flex flex-col items-start text-white pt-6 pb-6 pl-2 gap-3"

  const iconClass = specialPlan !== true ?
  "col-span-1 inline-block mr-3 text-gray-500 text-sm":
  "col-span-1 inline-block mr-3 text-white text-sm"

  return (
    <div className={rootClass}>
        <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left text-md">
            Deal-Finder Access + Exclusive Bots
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            eBay & Amazon Automation (Unlimited Sales)
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Financial Hub Automation
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Welcome to Flippify Course
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Exclusive Reselling Inner Circle
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Reseller News (Early Access)
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            In-Store Stock Monitors (Tesco, Nike Outlet..)
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            1-on-1 Onboarding Call
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Exclusive Weekly 1-on-1 Calls
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            VIP Community Access
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Beta Access to New Features
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Auto CSV Data Export
        </p>
      </div>
    </div>
  );
};

export default PlansCardPremiumWhatsIncluded;
