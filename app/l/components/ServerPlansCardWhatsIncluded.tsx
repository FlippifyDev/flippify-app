import React from "react";
import { IoMdCheckboxOutline } from "react-icons/io";

interface ServerPlansCardWhatsIncludedProps {
  whatsIncludedText: string[];
}

const ServerPlansCardWhatsIncluded: React.FC<ServerPlansCardWhatsIncludedProps> = ({ whatsIncludedText }) => {
  return (
    <div className="flex flex-col items-start text-paymentPlanText pt-6 pb-6 pl-2">
      <h2 className="mb-4 font-bold text-lg">What&apos;s included:</h2>
      {whatsIncludedText.map((text, index) => (
        <div key={index} className="grid grid-cols-12 mb-2 items-center">
          <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
          <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
            {text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ServerPlansCardWhatsIncluded;
