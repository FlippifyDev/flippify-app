"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface PlansGetAccessButtonProps {
    redirect: string;
    specialPlan?: boolean;
}

const PlansGetAccessButton: React.FC<PlansGetAccessButtonProps> = ({ redirect, specialPlan }) => {
    const router = useRouter();

    // Apply styles for the special plan
    const btnClass = specialPlan
        ? 'btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto rounded-lg shadow-lg'
        : 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg';

    return (
        <div className="relative group w-full flex flex-col justify-end">
            <button
                className={btnClass}
                onClick={() => router.push('/l/login')}
            >
                Get Access Now
            </button>
        </div>
    );
};

export default PlansGetAccessButton;
