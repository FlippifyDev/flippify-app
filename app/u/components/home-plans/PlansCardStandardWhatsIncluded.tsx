import React from "react";
import { IoMdCheckboxOutline } from "react-icons/io";
import { TbPointFilled } from "react-icons/tb";

interface Props {
  specialPlan?: boolean
}

const PlansCardStandardWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
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
          All Deal-Finding Bots
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Advanced Reselling Tools
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Priority Support
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
          Networking With Other Resellers
        </p>
      </div>
      {!specialPlan && (
        <div className="grid grid-cols-12 mb-2 items-center">
          <TbPointFilled className={iconClass} />
          <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Everything In Early Access
          </p>
        </div>
      )}
    </div>
  );
};

export default PlansCardStandardWhatsIncluded;
