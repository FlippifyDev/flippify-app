"use client";

import React from 'react';

interface ReferralTrackerProps {
  referrals: number;
}

const ReferralTracker: React.FC<ReferralTrackerProps> = ({ referrals }) => {
  const progress = referrals % 5;

  return (
    <div className="flex items-center">
      <ul className="flex justify-between w-full">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index} className="flex items-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center border ${index < progress ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-900'}`}>
              <span className="font-semibold">{index + 1}</span>
            </div>
            {index < 4 && (
              <div className="flex-1 h-1 mx-2">
                <div className={`h-full ${index < progress ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferralTracker;
