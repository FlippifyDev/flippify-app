import React, { useState } from 'react';

interface RewardOption {
  tier: number;
  option1: string;
  option2: string;
}

const rewardsData: RewardOption[] = [
  { tier: 1, option1: "£5 cash reward", option2: "25% off the next month’s subscription" },
  { tier: 2, option1: "£10 cash reward", option2: "50% off the next month’s subscription" },
  { tier: 3, option1: "£15 cash reward", option2: "One free month" },
  { tier: 4, option1: "£15 cash reward", option2: "One free month (ongoing)" },
];

interface ReferralRewardsModalProps {
  rewardsAvailable: number;
  onClose: () => void;
  onSubmit: (selectedRewards: string[]) => void;
}

const ReferralRewardsModal: React.FC<ReferralRewardsModalProps> = ({ rewardsAvailable, onClose, onSubmit }) => {
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);

  const handleRewardSelection = (tier: number, reward: string) => {
    setSelectedRewards((prev) => {
      const updated = [...prev];
      updated[tier - 1] = reward;
      return updated;
    });
  };

  const handleSubmit = () => {
    onSubmit(selectedRewards);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-6 text-center">Select Your Rewards</h2>
        {rewardsData.slice(0, rewardsAvailable).map(({ tier, option1, option2 }) => (
          <div key={tier} className="mb-6">
            <h3 className="font-bold text-lg mb-2">Tier {tier} Reward:</h3>
            <div className="flex justify-between">
              <button
                onClick={() => handleRewardSelection(tier, option1)}
                className={`w-full mx-1 py-2 rounded-lg font-semibold transition-all ${
                  selectedRewards[tier - 1] === option1 ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {option1}
              </button>
              <button
                onClick={() => handleRewardSelection(tier, option2)}
                className={`w-full mx-1 py-2 rounded-lg font-semibold transition-all ${
                  selectedRewards[tier - 1] === option2 ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {option2}
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-end mt-6">
          <button className="btn bg-red-500 text-white mr-3 px-4 py-2 rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button className="btn bg-green-500 text-white px-4 py-2 rounded-lg" onClick={handleSubmit}>
            Generate Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralRewardsModal;
