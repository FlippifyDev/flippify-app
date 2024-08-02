'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import SidebarBillingPortalButton from './SidebarBillingPortalButton';

const ProfileOverview = () => {
  const { data: session } = useSession();

  // Default avatar
  let avatar = "https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png";
  let username = "User";
  let customerId = "N/A";

  if (session) {
    if (session.user?.image) {
      avatar = session.user.image;
    }
    if (session.user?.name) {
      username = session.user.name;
    }
    if (session.user?.customerId) {
      customerId = session.user.customerId;
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center">
        <Image
          alt="Avatar"
          src={avatar}
          width={100}
          height={100}
          className="rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{username}</h2>
          <p className="text-gray-500 dark:text-gray-400">Customer ID: {customerId}</p>
          <div className="mt-2">
            <SidebarBillingPortalButton />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto mt-4 md:mt-0">
        <div className="stats shadow-md bg-white p-4 rounded-lg">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Subscription Status</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">Active</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white p-4 rounded-lg">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Profit Made</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">£0.00</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white p-4 rounded-lg">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Need Support?</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">
              <a
                href="https://discord.com/channels/1236428617962229830/1236436288442466394"
                className="btn border-0 bg-houseBlue hover:bg-green-400 text-white w-full"
              >
                Press the Button
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
