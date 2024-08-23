"use client"

import React from 'react'
import { useRouter } from "next/navigation";

interface DashboardNoSubscriptionButtonProps {
    username: string
}

const DashboardNoSubscriptionButton: React.FC<DashboardNoSubscriptionButtonProps> = ({ username }) => {
    const router = useRouter();

    const handleViewPlansClick = () => {
      router.push(`/u/${username}/plans`);
    };

    return (
        <button onClick={handleViewPlansClick} className="btn border-0 w-2/3 bg-houseBlue hover:bg-houseHoverBlue text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
            View Plans
        </button>
    )
}

export default DashboardNoSubscriptionButton
