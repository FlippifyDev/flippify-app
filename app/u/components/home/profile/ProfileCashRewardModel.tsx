import React from 'react';

interface ProfileCashRewardModalProps {
  onClose: () => void;
  referralCount: number;
  totalRewardsClaimed: number;
  selectedRewards: { [key: number]: number };
}

const ProfileCashRewardModal: React.FC<ProfileCashRewardModalProps> = ({
  onClose,
  referralCount,
  totalRewardsClaimed,
  selectedRewards,
}) => {
  // Function to copy the receipt text and open Discord link
  const copyReceipt = () => {
    const receiptText = `
      Hey Flippify Team,

      I would like to claim my rewards. Here is my receipt:

      Lifetime Referrals: ${referralCount}
      Total Rewards Claimed: ${totalRewardsClaimed}
      Selected Rewards: ${Object.entries(selectedRewards)
        .map(([tier, reward]) => `Tier ${tier}: £${reward} Cash Reward`)
        .join('\n')}

      Thank you!
    `;
    navigator.clipboard.writeText(receiptText);
    alert('Receipt copied to clipboard!');
    window.open(
      'https://discord.com/channels/1236428617962229830/1236436288442466394',
      '_blank'
    );
  };

  return (
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
                Tier {tier}: £{reward} Cash Reward
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between mt-6">
          <button
            className="btn border border-gray-300 text-black mr-3 px-4 py-2 rounded-lg bg-white hover:bg-gray-100"
            onClick={onClose}
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
  );
};

export default ProfileCashRewardModal;
