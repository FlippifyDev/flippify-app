"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { FaRegEdit } from "react-icons/fa";

const DashboardSubscriptionsCard = () => {
  const { data: session } = useSession();

  // Check if session and user data are available
  if (!session || !session.user || !("subscriptions" in session.user)) {
    return (
      <ul className="menu bg-white w-full shadow-xl rounded-box">
        <h2 className="text-lightModeText text-xl font-semibold">
          Subscriptions
        </h2>
        <p className="text-gray-600 mt-2">No subscriptions available.</p>
      </ul>
    );
  }

  // Extract subscriptions from session
  const { subscriptions } = session.user as {
    subscriptions: { name: string }[];
  };
  // Filter out subscriptions named "whitelisted"
  const filteredSubscriptions = subscriptions.filter(
    (sub) => sub.name !== "whitelisted"
  );

  return (
    <div className="card bg-white w-full shadow-md rounded-lg p-4 h-full">
      <h2 className="card-title text-lightModeText text-xl font-semibold">
        Subscriptions
      </h2>
      <div className="card-body w-full p-2">
        <div className="w-full">
          {filteredSubscriptions.length > 0 ? (
            <ul className="menu w-full p-2 rounded-box gap-1">
            {filteredSubscriptions.map((sub, index) => (
              <li key={index} className="w-full">
                <button className="border group w-full bg-white hover:bg-gray-100 text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md active:bg-gray-300 transition duration-200">
                  <span className="col-span-11 text-sm text-left">
                    {sub.name}
                  </span>
                  <span className="col-span-1 text-base text-right hidden group-hover:flex">
                    <FaRegEdit />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          ) : (
            <p className="text-gray-600">No subscriptions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSubscriptionsCard;