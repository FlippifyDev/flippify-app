"use client";

import SalesTrackerTabCalcProfits from "./SalesTrackerTabCalcProfits";
import SalesTrackerTabAddPurchase from "./SalesTrackerTabAddPurchase";
import SalesTrackerReviewProfits from "./SalesTrackerReviewProfits";
import SalesTrackerTabAddSale from "./SalesTrackerTabAddSale";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleUser } from '../../api/auth-firebase/firebaseConfig';  // Ensure this import is correct

const SalesTrackerPage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState("AddPurchase");
  const [userData, setUserData] = useState<{ uid: string, customerId: string } | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user && session.user.customerId) {
      const fetchUserData = async () => {
        try {
          const customerId = session.user.customerId;
          const data = await handleUser(customerId as string);
          setUserData(data);
        } catch (error) {
          console.error('Error handling user:', error);
        }
      };
      fetchUserData();
    }
  }, [session]);

  const toggleComponent = (component: string) => {
    setActiveComponent(component);
  };

  if (!session || !session.user || !session.user.customerId || !userData) {
    return <div>Loading...</div>;  // Display a loading state or a proper message
  }

  return (
    <div className="grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 w-full rounded-2xl p-1 mx-2 mt-2">
      <div className={`col-span-${activeComponent === "AddPurchase" ? "1" : "2"}`}>
        <div role="tablist" className="bg-lightGreyBackground flex rounded-t-2xl">
          <a
            role="tab"
            className={`font-semibold px-4 py-2 rounded-t-xl transition-colors duration-200 select-none ${
              activeComponent === "AddPurchase"
                ? "bg-gray-300 text-black border-b-2 border-gray-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => toggleComponent("AddPurchase")}
          >
            Add Purchase
          </a>
          <a
            role="tab"
            className={`px-4 py-2 font-semibold rounded-t-xl transition-colors duration-200 select-none ${
              activeComponent === "AddSale"
                ? "bg-gray-300 text-black border-b-2 border-gray-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => toggleComponent("AddSale")}
          >
            Add Sale
          </a>
          <a
            role="tab"
            className={`font-semibold px-4 py-2 rounded-t-xl transition-colors duration-200 select-none ${
              activeComponent === "ReviewProfits"
                ? "bg-gray-300 text-black border-b-2 border-gray-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => toggleComponent("ReviewProfits")}
          >
            Review Profits
          </a>
        </div>
        <div className="bg-white bg-opacity-90 p-4 rounded-b-xl h-full">
          {activeComponent === "AddPurchase" && <SalesTrackerTabAddPurchase userData={userData} />}
          {activeComponent === "AddSale" && <SalesTrackerTabAddSale userData={userData} />}
          {activeComponent === "ReviewProfits" && <SalesTrackerReviewProfits userData={userData} />}
        </div>
      </div>
      {activeComponent === "AddPurchase" && (
        <div>
          <div role="tablist" className="flex bg-lightGreyBackground rounded-t-2xl pt-1 md:pt-0">
            <a
              role="tab"
              className="text-black font-semibold bg-gray-300 border-b-2 border-gray-500 px-4 py-2 rounded-t-xl transition-colors duration-200 select-none"
            >
              Calculate Profits
            </a>
          </div>
          <div className="bg-white bg-opacity-90 p-4 rounded-b-xl col-span-1 h-full">
            <SalesTrackerTabCalcProfits userData={userData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTrackerPage;