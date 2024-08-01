"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const ProfileOverview = () => {
  const { data: session } = useSession();

  // Default avatar
  let avatar = "https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png";
  let username = "User";

  if (session) {
    if (session.user?.image) {
      avatar = session.user.image;
    }
    if (session.user?.name) {
      username = session.user.name;
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md dark:bg-gray-800 p-4 md:p-6 flex justify-between items-center">
      <div className="flex items-center">
        <Image
          alt="Avatar"
          src={avatar}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{username}</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
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
            <div className="stat-title text-sm sm:text-base text-houseBlue">Next Payment Date</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">Placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
