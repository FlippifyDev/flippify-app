import React from "react";
import { TbPointFilled } from "react-icons/tb";


interface ServerPlansCardWhatsIncludedProps {
    whatsIncludedText: string[];
    specialPlan?: boolean
}


const ServerPlansCardWhatsIncluded: React.FC<ServerPlansCardWhatsIncludedProps> = ({ whatsIncludedText, specialPlan }) => {
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
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[0]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[1]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[2]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[3]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <TbPointFilled className={iconClass} />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[4]}
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
          Live Alerts In Your Server
        </p>
      </div>
    </div>
  );
};

export default ServerPlansCardWhatsIncluded;
