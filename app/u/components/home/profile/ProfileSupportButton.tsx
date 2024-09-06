'use client';

// External Imports
import React from 'react';
import { BiSupport } from "react-icons/bi";

const ProfileSupportButton = () => {
  const handleSupportButtonClick = () => {
    window.open("https://discord.com/channels/1236428617962229830/1236436288442466394", '_blank');
  };

  return (
    <button
      className="w-auto text-lightModeText flex items-center gap-2 rounded-md transition duration-200 focus:outline-none hover:text-gray-500"
      onClick={handleSupportButtonClick}
    >
      <span className="flex items-center gap-2">
        <BiSupport className="text-lg" />
        <span className="text-base text-left">Support Channel</span>
      </span>
    </button>
  );
}

export default ProfileSupportButton;
