import React from "react";
import { IoMdCheckboxOutline } from "react-icons/io";


const PlansWhatsIncluded = () => {
  return (
    <div className="flex flex-col items-start text-white pt-6 pb-6 pl-2">
      <h2 className="mb-4 font-bold text-lg">What&apos;s included:</h2>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          All Deal-Finding Bots
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          All Reselling Tools
          
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Reselling Course 1.0
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Priority Support
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Exclusive Reselling Inner Circle
        </p>
      </div>
      <div className="grid grid-cols-12 mb-2 items-center">
        <IoMdCheckboxOutline className="col-span-1 inline-block mr-3 text-paymentPlanText" />
        <p className="ml-1 sm:ml-0 col-span-11 mb-0 text-left">
          Networking & Self Promotion Access
        </p>
      </div>
    </div>
  );
};

export default PlansWhatsIncluded;
