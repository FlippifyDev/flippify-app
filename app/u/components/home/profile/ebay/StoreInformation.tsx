"use client";

// External Imports
import React, { useState } from "react";

// Local Imports
import { IEbayWarehouseData } from "@/models/ebay-api-models";



interface StoreInformationProps {
  onSubmit: (data: IEbayWarehouseData) => void;
  customerId: string | undefined;
}

const StoreInformation:React.FC<StoreInformationProps> = ({ onSubmit, customerId }) => {
  const [formData, setFormData] = useState<IEbayWarehouseData>({
    location: {
      address: {
        city: "",
        country: "",
        stateOrProvince: ""
      }
    },
    name: customerId || "",
    merchantLocationStatus: "ENABLED",
    locationTypes: ["WAREHOUSE"],
  });

  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      location: {
        ...prevData.location,
        address: {
          ...prevData.location.address,
          [name]: value,
        },
      },
    }));
  };


  return (
    <div className="h-screen flex justify-center items-center">
      <div className="max-w-lg mx-auto p-4 border rounded shadow-lg bg-white w-[400px]">
        <h2 className="text-2xl font-bold mb-4">Store Information</h2>
        <form onSubmit={() => onSubmit(formData)}>
          {/* Address Inputs */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="city">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.location.address.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="stateOrProvince">
              State/Province:
            </label>
            <input
              type="text"
              id="stateOrProvince"
              name="stateOrProvince"
              value={formData.location.address.stateOrProvince}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="country">
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.location.address.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className="mt-4 text-lg text-red-500">{statusMessage}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-houseBlue text-white rounded mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreInformation;
