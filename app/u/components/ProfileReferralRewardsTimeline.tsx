import React from 'react';

interface ReferralRewardsTimelineProps {
  availableRewards: number;
  referralCount: number;
  totalRewardsClaimed: number;
  onRewardSelect: (tier: number, reward: string) => void;
}

const ReferralRewardsTimeline: React.FC<ReferralRewardsTimelineProps> = ({
  availableRewards,
  referralCount,
  totalRewardsClaimed,
  onRewardSelect
}) => {
  const rewards = [
    { id: 1, leftOption: "£5 Cash Reward", rightOption: "25% Off Next Month" },
    { id: 2, leftOption: "£10 Cash Reward", rightOption: "50% Off Next Month" },
    { id: 3, leftOption: "£15 Cash Reward", rightOption: "One Free Month" },
    { id: 4, leftOption: "£15 Cash Reward", rightOption: "One Free Month (Ongoing)" },
  ];

  const currentTier = totalRewardsClaimed + 1;

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <ul className="timeline timeline-vertical">
        {rewards.map((reward, index) => (
          <li key={reward.id} className="flex items-center mb-4">
            {/* Left Option */}
            <div className="flex-1">
              <button
                onClick={() => onRewardSelect(reward.id, reward.leftOption)}
                className={`btn w-full ${
                  reward.id <= referralCount && reward.id <= currentTier ? 'btn-primary' : 'btn-disabled'
                }`}
                disabled={reward.id > currentTier}
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
                className={`text-${reward.id <= currentTier ? 'blue' : 'gray'}-500 h-5 w-5`}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              {index < rewards.length - 1 && (
                <div className={`w-px h-8 bg-${reward.id <= currentTier ? 'blue' : 'gray'}-500`}></div>
              )}
            </div>

            {/* Right Option */}
            <div className="flex-1">
              <button
                onClick={() => onRewardSelect(reward.id, reward.rightOption)}
                className={`btn w-full ${
                  reward.id <= referralCount && reward.id <= currentTier ? 'btn-primary' : 'btn-disabled'
                }`}
                disabled={reward.id > currentTier}
              >
                {reward.rightOption}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferralRewardsTimeline;
