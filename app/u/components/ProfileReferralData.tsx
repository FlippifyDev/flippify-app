"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import ReferralTracker from './ProfileReferralTracker'; // Adjust the import path as necessary
import { FaClipboard } from 'react-icons/fa';

const ProfileReferralData: React.FC = () => {
  const { data: session } = useSession();
  const referralCode = session?.user?.referral?.referral_code || "None";
  const referralCount = session?.user?.referral?.valid_referral_count || 0;
  const totalRewardsClaimed = session?.user?.referral?.rewards_claimed || 0;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const handleClaimRewards = () => {
    window.location.href = "https://discord.com/channels/1236428617962229830/1236436288442466394";
  };

  const requiredReferrals = 5;
  const totalEligibleRewards = Math.floor(referralCount / requiredReferrals);
  const remainingRewards = totalEligibleRewards - totalRewardsClaimed;
  const remainingReferrals = requiredReferrals - (referralCount % requiredReferrals);

  return (
    <div className="card bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="card-title text-black text-xl font-semibold">Referral Program</h2>
        <ReferralTracker referrals={referralCount} />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white mr-2">Your code:</p>
          <button
            className="flex items-center px-2 py-1 bg-gray-100 border rounded-lg hover:bg-gray-200 transition duration-200"
            onClick={copyToClipboard}
          >
            <span className="mr-2">{referralCode}</span>
            <FaClipboard className="text-gray-900 dark:text-white" />
          </button>
        </div>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Users must subscribe to count as a valid referral.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 mx-16">
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 text-center">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Lifetime Referrals</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">{referralCount}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white w-full flex-shrink-0 overflow-x-auto p-0 sm:p-2 text-center">
          <div className="stat">
            <div className="stat-title text-sm sm:text-base text-houseBlue">Total Rewards Claimed</div>
            <div className="stat-value font-bold text-xl sm:text-2xl text-black">{totalRewardsClaimed}</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {remainingRewards <= 0
            ? "You don't have any rewards to claim."
            : `You can claim £${remainingRewards * 30} or ${remainingRewards} months of free membership.`}
        </h3>
        <button
          type="button"
          onClick={handleClaimRewards}
          disabled={remainingRewards <= 0}
          className={`mt-2 inline-block text-white py-2 px-4 rounded-md w-48 transition duration-200 ${
            remainingRewards <= 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-green-400"
          }`}
        >
          {remainingRewards <= 0
            ? `Need ${remainingReferrals} more referrals`
            : "Claim Rewards"}
        </button>
      </div>
    </div>
  );
};

export default ProfileReferralData;
