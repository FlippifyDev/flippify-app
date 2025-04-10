'use client';

// Local Imports

import { discordSupportLink } from '@/utils/constants';

// External Imports
import { BiSupport } from "react-icons/bi";
import React from 'react';

const ProfileSupportButton = () => {
    const handleSupportButtonClick = () => {
        window.open(discordSupportLink, '_blank');
    };

    return (
        <button
            className="w-auto text-lightModeText flex items-center gap-2 rounded-md transition duration-200 focus:outline-none hover:text-gray-500"
            onClick={handleSupportButtonClick}
        >
            <span className="flex items-center gap-2">
                <BiSupport className="text-md sm:text-lg" />
                <span className="text-sm sm:text-md text-left">Support Channel</span>
            </span>
        </button>
    );
}

export default ProfileSupportButton;
