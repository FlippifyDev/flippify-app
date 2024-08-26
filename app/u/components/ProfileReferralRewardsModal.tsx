import React, { useState } from 'react';
import ReferralRewardsTimeline from './ProfileReferralRewardsTimeline';

interface ReferralRewardsModalProps {
  availableRewards: number;
  referralCount: number;
  totalRewardsClaimed: number;
  onClose: () => void;
  onSubmit: (selectedRewards: string[]) => void;
}

const ReferralRewardsModal: React.FC<ReferralRewardsModalProps> = ({
  availableRewards,
  referralCount,
  totalRewardsClaimed,
  onClose,
  onSubmit
}) => {
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
        <ReferralRewardsTimeline
          availableRewards={availableRewards}
          referralCount={referralCount}
          totalRewardsClaimed={totalRewardsClaimed}
          onRewardSelect={handleRewardSelection}
        />
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
