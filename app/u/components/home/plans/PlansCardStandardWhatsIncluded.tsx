import React from "react";
import { SiTicktick } from "react-icons/si";

interface Props {
  specialPlan?: boolean
}

const PlansCardStandardWhatsIncluded: React.FC<Props> = ({ specialPlan }) => {
  const rootClass = specialPlan !== true ? 
  "flex flex-col items-start text-gray-500 pt-6 pb-6 pl-2 gap-3": 
  "flex flex-col items-start text-white pt-6 pb-6 pl-2 gap-3"

  const iconClass = "col-span-1 inline-block mr-3 text-houseBlue text-sm"
  const comingSoonIconClass = "col-span-1 inline-block mr-3 text-grey-200 text-sm"

  return (
    <div className="mb-4">
      <div className="text-black font-semibold mt-2 ml-2 mb-[-6px]">
        <p>
          Features Include:
        </p>
      </div>
      <div className={rootClass}>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left text-md">
            All Deal-Finding Bots
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={iconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Exclusive Reselling Inner Circle
          </p>
        </div>
      </div>
      <div className="text-black font-semibold ml-2 mb-[-6px]">
        <p>
          Coming Soon:
        </p>
      </div>
      <div className={rootClass}>
      <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            20 Manually Tracked Sales/month
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Financial Hub (Manual)
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            Inventory & Order Management (Manual)
          </p>
        </div>
        <div className="grid grid-cols-12 mb-2 items-center">
          <SiTicktick className={comingSoonIconClass} />
          <p className="pl-2 ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            'Welcome to Flippify' Course
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlansCardStandardWhatsIncluded;
