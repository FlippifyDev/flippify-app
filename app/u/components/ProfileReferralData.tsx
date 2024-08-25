'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaClipboard } from 'react-icons/fa';
import ReferralRewardsModal from './ProfileReferralRewardsModal';
import ReferralRewardsTimeline from './ProfileReferralRewardsTimeline';

const ProfileReferralData: React.FC = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const referralCode = session?.user?.referral?.referral_code || 'None';
  const referralCount = session?.user?.referral?.valid_referrals.length || 0;
  const totalRewardsClaimed = session?.user?.referral?.rewards_claimed || 0;
  const remainingRewards = referralCount - totalRewardsClaimed;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const handleModalClose = () => setIsModalOpen(false);

  return (
    <div className="card bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="card-title text-black text-xl font-semibold">Referral Program</h2>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <p className="text-lg font-semibold text-gray-900 mr-2">Your code:</p>
          <button
            className="flex items-center px-2 py-1 bg-gray-100 border rounded-lg hover:bg-gray-200 transition duration-200"
            onClick={copyToClipboard}
          >
            <span className="mr-2">{referralCode}</span>
            <FaClipboard className="text-gray-900" />
          </button>
        </div>
        <p className="text-sm text-gray-500 px-2 text-center sm:text-left">
          Users must subscribe to count as a valid referral.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="stats shadow-md bg-white p-2 text-center">
          <div className="stat">
            <div className="stat-title text-sm text-houseBlue">Lifetime Referrals</div>
            <div className="stat-value text-xl font-bold text-black">{referralCount}</div>
          </div>
        </div>
        <div className="stats shadow-md bg-white p-2 text-center">
          <div className="stat">
            <div className="stat-title text-sm text-houseBlue">Total Rewards Claimed</div>
            <div className="stat-value text-xl font-bold text-black">{totalRewardsClaimed}</div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {remainingRewards > 0 ? 'You have rewards to claim!' : 'No rewards available at the moment.'}
        </h3>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`mt-2 inline-block text-white py-2 px-4 rounded-md w-48 transition duration-200 ${
            remainingRewards <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-houseHoverBlue'
          }`}
          disabled={remainingRewards <= 0}
        >
          Claim Rewards
        </button>
      </div>
      {isModalOpen && (
        <ReferralRewardsModal
          rewardsAvailable={remainingRewards}
          onClose={handleModalClose}
          onSubmit={(selectedRewards) => {
            // Handle receipt generation or reward submission here
            console.log(selectedRewards);
          }}
        />
      )}
    </div>
  );
};

export default ProfileReferralData;
