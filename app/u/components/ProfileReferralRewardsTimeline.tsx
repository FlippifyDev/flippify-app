"use client";

import React from 'react';

interface ReferralRewardsTimelineProps {
  availableRewards: number;
  selectedRewards: { [key: number]: string };
  handleRewardSelection: (tier: number, reward: string) => void;
}

const ReferralRewardsTimeline: React.FC<ReferralRewardsTimelineProps> = ({
  availableRewards,
  selectedRewards,
  handleRewardSelection,
}) => {
  const rewards = [
    { id: 1, leftOption: "£5 Cash Reward", rightOption: "25% Off Next Month" },
    { id: 2, leftOption: "£10 Cash Reward", rightOption: "50% Off Next Month" },
    { id: 3, leftOption: "£15 Cash Reward", rightOption: "One Free Month" },
    { id: 4, leftOption: "£15 Cash Reward", rightOption: "One Free Month" },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <ul className="timeline timeline-vertical">
        {rewards.map((reward, index) => {
          const isDisabled = availableRewards < reward.id;
          return (
            <li key={reward.id} className="flex items-center mb-4">
              {/* Left Option */}
              <div className="flex-1">
                <button
                  className={`w-full p-4 rounded-lg transition-all ${
                    selectedRewards[reward.id] === reward.leftOption
                      ? 'border-houseBlue bg-white shadow-lg'
                      : `bg-white ${
                          isDisabled ? 'text-gray-400 border-gray-300' : 'shadow-lg hover:shadow-lg hover:border-houseBlue'
                        }`
                  } ${isDisabled ? 'text-gray-400 border-gray-300 shadow-none' : ''}`}
                  onClick={() => handleRewardSelection(reward.id, reward.leftOption)}
                  disabled={isDisabled}
                >
                  {reward.leftOption}
                </button>
              </div>

              {/* Timeline Icon */}
              <div className="flex flex-col items-center mx-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-5 w-5 ${isDisabled ? 'text-gray-400' : 'text-houseBlue'}`}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {index < rewards.length - 1 && (
                  <div className={`w-px h-8 ${isDisabled ? 'bg-gray-300' : 'bg-houseBlue'}`}></div>
                )}
              </div>

              {/* Right Option */}
              <div className="flex-1">
                <button
                  className={`w-full p-4 rounded-lg transition-all ${
                    selectedRewards[reward.id] === reward.rightOption
                      ? 'border-houseBlue bg-white shadow-lg'
                      : `bg-white ${
                          isDisabled ? 'text-gray-400 border-gray-300' : 'shadow-lg hover:shadow-lg hover:border-houseBlue'
                        }`
                  } ${isDisabled ? 'text-gray-400 border-gray-300 shadow-none' : ''}`}
                  onClick={() => handleRewardSelection(reward.id, reward.rightOption)}
                  disabled={isDisabled}
                >
                  {reward.rightOption}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ReferralRewardsTimeline;
