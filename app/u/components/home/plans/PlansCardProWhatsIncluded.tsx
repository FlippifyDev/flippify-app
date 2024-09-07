import React from "react";
import { TbPointFilled } from "react-icons/tb";

interface Props {
  specialPlan?: boolean
}

const PlansCardStandardWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = specialPlan !== true ? 
  "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3": 
  "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3"

  const iconClass = specialPlan !== true ?
  "col-span-1 inline-block mr-3 text-gray-500 text-sm":
  "col-span-1 inline-block mr-3 text-gray-500 text-sm"

  return (
    <div className={rootClass}>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left text-md">
          Deal-Finder Access
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
          Reseller News
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          In-Store Stock Monitors (Tesco, Nike Outlet..)
        </p>
      </div>
    </div>
  );
};

export default PlansCardStandardWhatsIncluded;
