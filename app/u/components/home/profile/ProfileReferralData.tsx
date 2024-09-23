"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaClipboard } from 'react-icons/fa';
import ReferralRewardsTimeline from './ProfileReferralRewardsTimeline';
import { ISubscription } from '@/app/api/auth-mongodb/userModel';
import createAndApplyCoupon from '@/app/api/stripe-handlers/create-and-apply-coupon';
import incrementRewardsClaimed from '@/app/api/auth-mongodb/increment-rewards-claim';
import checkForExistingDiscount from '@/app/api/stripe-handlers/check-for-existing-discount';
import ProfileCashRewardModal from './ProfileCashRewardModel';

const ProfileReferralData: React.FC = () => {
  const { data: session } = useSession();
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedRewards, setSelectedRewards] = useState<{ [key: number]: number }>({});
  const [canSelectSubscription, setCanSelectSubscription] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showCashRewardModal, setShowCashRewardModal] = useState(false);
  const [showDiscountRewardModal, setShowDiscountRewardModal] = useState(false); 

  const customerId = session?.user?.customerId || 'None';
  const referralCode = session?.user?.referral?.referral_code || 'None';
  const referralCount = session?.user?.referral?.valid_referrals.length || 0;
  const totalRewardsClaimed = session?.user?.referral?.rewards_claimed || 0;

  let availableRewards;
  if (referralCount - totalRewardsClaimed === 0) {
    availableRewards = 0;
  } else {
    availableRewards = referralCount <= 3 ? referralCount : 3;
  }

  const userSubscriptions = session?.user?.subscriptions?.filter((sub: ISubscription) => 
    !sub.name.includes('accessGranted')
  ) || [];

  const memberSubscriptions = session?.user?.subscriptions?.filter((sub: ISubscription) => 
    sub.name.includes('member')
  ) || [];

  useEffect(() => {
    const checkDiscounts = async () => {
      const hasDiscount = await checkForExistingDiscount(customerId);
      setDiscountApplied(hasDiscount);
    };
    
    checkDiscounts();
  }, [session]);

  useEffect(() => {
    const allSelected = parseInt(Object.keys(selectedRewards)[0]) === availableRewards;
    setCanSelectSubscription(allSelected);
  }, [selectedRewards, availableRewards]);

  const handleRewardSelection = (tier: number, discount: number, cash: number, isSelectedLeft: boolean, isSelectedRight: boolean) => {
    if (isSelectedLeft) { // Assuming tier 1 is the cash reward
      setSelectedRewards((prev) => ({ ...prev, [tier]: cash }));
    } else if (isSelectedRight) {
      setSelectedRewards((prev) => ({ ...prev, [tier]: discount }));
    }
  };

  const handleSelectSubscription = () => {
    if ([5, 10, 15].includes(Object.values(selectedRewards)[0])) {
      setIsTimelineOpen(false);
      setShowCashRewardModal(true);
    } else if ([25, 50, 100].includes(Object.values(selectedRewards)[0])) {
      setIsTimelineOpen(false);
      setShowDiscountRewardModal(true);
    }
  };

  const handleSubscriptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubscription(e.target.value);
  };

  const applyRewardToSubscription = async () => {
    await createAndApplyCoupon(selectedSubscription, customerId, Object.values(selectedRewards)[0]);
    await incrementRewardsClaimed(customerId);
    setIsTimelineOpen(false);
    setShowDiscountRewardModal(false);
    setShowCongratulations(true);
  };

  const handleCloseCongradulations = () => {
    setShowCongratulations(false);
    window.location.reload();
  };

  const closeCashRewardModal = () => {
    setShowCashRewardModal(false);
  };


  return (
    <div className="card bg-white shadow-md rounded-lg p-4 h-full flex flex-col">
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
            onClick={() => {
              navigator.clipboard.writeText(referralCode);
              alert('Referral code copied to clipboard!');
            }}
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

      {userSubscriptions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Subscriptions</h3>
          <ul className="mt-2 list-disc list-inside">
            {userSubscriptions.map((subscription, index) => (
              <li key={index} className="text-gray-700">
                {subscription.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-center relative group">
        <h3 className="text-lg font-semibold text-gray-900">
          {availableRewards > 0 
            ? discountApplied 
              ? 'Discount already active. You can claim again after discount is over.' 
              : 'You have rewards to claim!' 
            : 'No rewards available at the moment.'}
        </h3>

        <button
          type="button"
          onClick={() => setIsTimelineOpen(true)}
          className={`mt-2 inline-block text-white py-2 px-4 rounded-md w-48 transition duration-200 ${
            availableRewards <= 0 || discountApplied ? 'bg-gray-300 cursor-not-allowed' : 'bg-houseBlue hover:bg-houseHoverBlue'
          }`}
          disabled={availableRewards <= 0 || discountApplied}
        >
          Claim Rewards
        </button>
      </div>


      {/* Congratulations Modal */}
      {showCongratulations && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h4 className="text-xl font-semibold mb-2">Congratulations!</h4>
            <p>Your rewards have been successfully applied!</p>
            <div className="flex justify-end mt-4">
              <button
                className="btn bg-houseBlue hover:bg-houseHoverBlue text-white px-4 py-2 rounded-lg"
                onClick={handleCloseCongradulations}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isTimelineOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-6 text-center">Select Your Rewards</h2>
            <ReferralRewardsTimeline
              availableRewards={availableRewards}
              selectedRewards={selectedRewards}
              handleRewardSelection={handleRewardSelection}
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
                  canSelectSubscription ? 'bg-houseBlue hover:bg-houseHoverBlue' : 'bg-gray-300 cursor-not-allowed'
                } text-white px-4 py-2 rounded-lg`}
                onClick={handleSelectSubscription}
                disabled={!canSelectSubscription}
              >
                Select Reward
              </button>
            </div>
          </div>
        </div>
      )}

      {showDiscountRewardModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
            <h3 className="text-lg font-semibold mb-4">Select Subscription to Apply Rewards</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subscription:</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                onChange={handleSubscriptionChange}
                value={selectedSubscription || ''}
              >
                <option value="" disabled>Select a subscription</option>
                {memberSubscriptions.map((subscription, index) => (
                  <option key={index} value={subscription.name}>
                    {subscription.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mt-6">
              <button
                className="btn border border-gray-300 text-black mr-3 px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
                onClick={() => {
                  setShowDiscountRewardModal(false);
                  setIsTimelineOpen(true);
                }}
              >
                Back
              </button>
              <button
                className="btn bg-houseBlue hover:bg-houseHoverBlue text-white px-4 py-2 rounded-lg"
                onClick={applyRewardToSubscription}
                disabled={!selectedSubscription}
              >
                Apply Reward
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Reward Modal */}
      {showCashRewardModal && <ProfileCashRewardModal onClose={closeCashRewardModal} referralCount={referralCount} totalRewardsClaimed={totalRewardsClaimed} selectedRewards={selectedRewards}/>}
    </div>
  );
};

export default ProfileReferralData;
