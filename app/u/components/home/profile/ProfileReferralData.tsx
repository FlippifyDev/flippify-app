"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaClipboard } from 'react-icons/fa';
import ReferralRewardsTimeline from './ProfileReferralRewardsTimeline';
import Alert from '@/app/components/Alert';

const ProfileReferralData: React.FC = () => {
  const { data: session } = useSession();
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedRewards, setSelectedRewards] = useState<{ [key: number]: string }>({});
  const [canGenerateReceipt, setCanGenerateReceipt] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const referralCode = session?.user?.referral?.referral_code || 'None';
  const referralCount = session?.user?.referral?.valid_referrals.length || 0;
  const totalRewardsClaimed = session?.user?.referral?.rewards_claimed || 0;
  const availableRewards = referralCount - totalRewardsClaimed;

  useEffect(() => {
    const allSelected = Object.keys(selectedRewards).length === availableRewards;
    setCanGenerateReceipt(allSelected);
  }, [selectedRewards, availableRewards]);

  const handleRewardSelection = (tier: number, reward: string) => {
    setSelectedRewards((prev) => ({ ...prev, [tier]: reward }));
  };

  const handleGenerateReceipt = () => {
    if (canGenerateReceipt) {
      setIsTimelineOpen(false);
      setIsReceiptOpen(true);
    }
  };

  const copyReceipt = () => {
    const receiptText = `
      Hey Flippify Team,

      I would like to claim my rewards. Here is my receipt:

      Lifetime Referrals: ${referralCount}
      Total Rewards Claimed: ${totalRewardsClaimed}
      Selected Rewards: ${Object.entries(selectedRewards)
        .map(([tier, reward]) => `Tier ${tier}: ${reward}`)
        .join('\n')}

      Thank you!
    `;
    navigator.clipboard.writeText(receiptText);
    setAlertMessage('Receipt copied to clipboard!');
    setIsAlertVisible(true);
    window.open(
      'https://discord.com/channels/1236428617962229830/1236436288442466394',
      '_blank'
    );
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setAlertMessage('Referral code copied to clipboard!');
    setIsAlertVisible(true); 
  };

  return (
    <div className="card bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
      <Alert message={alertMessage} visible={isAlertVisible} onClose={() => setIsAlertVisible(false)} />

      <div className="flex justify-between items-center mb-2">
        <h2 className="card-title text-black text-xl font-semibold">Referral Program</h2>
        <p className="text-sm text-gray-500 px-2 text-center sm:text-left">
          Users must subscribe to count as a valid referral.
        </p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <p className="text-lg font-semibold text-gray-900 mr-2">Your code:</p>
          <button
            className="flex items-center px-2 py-1 bg-gray-100 border rounded-lg hover:bg-gray-200 transition duration-200"
            onClick={copyReferralCode}
          >
            <span className="mr-2">{referralCode}</span>
            <FaClipboard className="text-gray-900" />
          </button>
        </div>
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
          {availableRewards > 0 ? 'You have rewards to claim!' : 'No rewards available at the moment.'}
        </h3>
        <button
          type="button"
          onClick={() => setIsTimelineOpen(true)}
          className={`mt-2 inline-block text-white py-2 px-4 rounded-md w-48 transition duration-200 ${
            availableRewards <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-houseBlue hover:bg-houseHoverBlue'
          }`}
          disabled={availableRewards <= 0}
        >
          Claim Rewards
        </button>
      </div>

      {/* Timeline Modal */}
      {isTimelineOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-6 text-center">Select Your Rewards</h2>
            <ReferralRewardsTimeline
              availableRewards={availableRewards}
              selectedRewards={selectedRewards}
              handleRewardSelection={handleRewardSelection}
              totalRewardsClaimed={totalRewardsClaimed} // Pass the total rewards claimed
            />
            <div className="flex justify-between mt-6">
              <button
                className="btn border border-gray-300 text-black mr-3 px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
                onClick={() => setIsTimelineOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`btn ${
                  canGenerateReceipt ? 'bg-houseBlue hover:bg-houseHoverBlue' : 'bg-gray-300 cursor-not-allowed'
                } text-white px-4 py-2 rounded-lg`}
                onClick={handleGenerateReceipt}
                disabled={!canGenerateReceipt}
              >
                Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {isReceiptOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-4">Your Rewards Receipt</h3>
            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
              <p>Hey Flippify Team,</p>
              <p>I would like to claim my rewards. Here is my receipt:</p>
              <p><strong>Lifetime Referrals:</strong> {referralCount}</p>
              <p><strong>Total Rewards Claimed:</strong> {totalRewardsClaimed}</p>
              <p><strong>Selected Rewards:</strong></p>
              <ul className="list-disc ml-4">
                {Object.entries(selectedRewards).map(([tier, reward]) => (
                  <li key={tier}>
                    Tier {tier}: {reward}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="btn border border-gray-300 text-black mr-3 px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
                onClick={() => {
                  setIsReceiptOpen(false);
                  setIsTimelineOpen(true);
                }}
              >
                Back
              </button>
              <button
                className="btn bg-houseBlue hover:bg-houseHoverBlue text-white px-4 py-2 rounded-lg"
                onClick={copyReceipt}
              >
                Copy Receipt & Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileReferralData;
