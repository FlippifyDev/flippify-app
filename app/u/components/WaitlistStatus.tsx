import React from "react";
import { FaRegClock, FaCodeBranch, FaUsers } from 'react-icons/fa';

interface WaitlistStatusProps {
  position: number | null;
  referralCode: string | null;
  referralCount: number;
}

const WaitlistStatus: React.FC<WaitlistStatusProps> = ({ position, referralCode, referralCount }) => {
  return (
    <div className="bg-white py-8 px-6 rounded-3xl shadow-lg border border-gray-300 max-w-md mx-auto">
      <p className="text-4xl font-bold text-center text-gray-900 mb-6">
        You&apos;re on the Waitlist!
      </p>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md border border-gray-200">
          <FaRegClock className="text-blue-500 mr-4 text-2xl" />
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-700">Queue Position:</p>
            <p className="text-xl text-gray-900">{position !== null ? position : "Loading..."}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md border border-gray-200">
          <FaCodeBranch className="text-green-500 mr-4 text-2xl" />
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-700">Referral Code:</p>
            <p className="text-xl text-gray-900">{referralCode || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-md border border-gray-200">
          <FaUsers className="text-purple-500 mr-4 text-2xl" />
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-700">Friends Referred:</p>
            <p className="text-xl text-gray-900">{referralCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistStatus;
