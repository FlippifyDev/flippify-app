import React from "react";
import { IoMdCheckboxOutline } from "react-icons/io";


interface ServerPlansWhatsIncludedProps {
    whatsIncludedText: string[];
}


const ServerPlansWhatsIncluded: React.FC<ServerPlansWhatsIncludedProps> = ({ whatsIncludedText }) => {
  return (
    <div className="flex flex-col items-start text-white pt-6 pb-6 pl-2">
      <h2 className="mb-4 font-bold text-lg">What&apos;s included:</h2>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[0]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[1]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[2]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[3]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          {whatsIncludedText[4]}
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Advanced Reselling Tools
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Live Alerts In Your Server
        </p>
      </div>
    </div>
  );
};

export default ServerPlansWhatsIncluded;
