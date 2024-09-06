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
        {/*<h2 className="mb-4 font-bold text-lg">What&apos;s included:</h2>*/}
        <div className="grid grid-cols-12 mb-2 items-center">
            <TbPointFilled className={iconClass} />
            <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left text-md">
                Everything in Standard
            </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
            <TbPointFilled className={iconClass} />
            <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                eBay Fulfulment
            </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
            <TbPointFilled className={iconClass} />
            <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                AI Store Integration
            </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
            <TbPointFilled className={iconClass} />
            <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Data Visualisation and Reporting
            </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
            <TbPointFilled className={iconClass} />
            <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Self Promotion Access
            </p>
        </div>

        <div className="grid grid-cols-12 mb-2 items-center">
            <TbPointFilled className={iconClass} />
            <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
                Access To All Courses
            </p>
        </div>

    </div>
  );
};

export default PlansCardPremiumWhatsIncluded;
