"use client";

// Local Imports
import { ISubscription } from '@/models/user';
import { createAndApplyCoupon } from '@/services/stripe/create';
import { checkForExistingDiscount } from '@/services/stripe/retrieve';

// External Imports
import { useState, useEffect } from 'react';
import { FaClipboard } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { incrementRewardsClaimed } from '@/services/firebase/admin-increment';
import { retrieveIdToken } from '@/services/firebase/retrieve';

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

    const customerId = session?.user?.stripeCustomerId || 'None';
    const referralCode = session?.user?.referral?.referralCode || 'None';
    const referralCount = session?.user?.referral?.validReferrals?.length || 0;
    const totalRewardsClaimed = session?.user?.referral?.rewardsClaimed || 0;

    const availableRewards = referralCount - totalRewardsClaimed > 0 ? referralCount : 0;

    const userSubscriptions = session?.user?.subscriptions || [];
    // Disabled while in development
    const isMember = false;//userSubscriptions.some((sub: ISubscription) => sub.name.includes('member'));

    useEffect(() => {
        const checkDiscounts = async () => {
            const hasDiscount = await checkForExistingDiscount(customerId);
            setDiscountApplied(hasDiscount);
        };
        checkDiscounts();
    }, [customerId]);

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
        const idToken = await retrieveIdToken();
        if (!idToken) return;

        await createAndApplyCoupon(selectedSubscription, customerId, Object.values(selectedRewards)[0]);
        await incrementRewardsClaimed({ idToken });
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
        <div className="relative group w-full h-full">
            {!isMember && (
                <div className="absolute inset-0 bg-gray-100 bg-opacity-90 z-10 flex items-center justify-center rounded-xl">
                    <div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
                        In Development{/*Membership Required*/}
                    </div>
                </div>
            )}

            {/* Referral Data Section */}
            <div className="card bg-white shadow rounded-xl h-full flex flex-col">
                <div className="flex justify-between items-center border-b py-4 px-6">
                    <h2 className="card-title text-black text-lg font-semibold">Referral Program</h2>
                    <p className="text-sm text-gray-500 px-2 text-center sm:text-left">
                        Users must subscribe to count as a valid referral.
                    </p>
                </div>
                <div className="flex justify-between items-center p-4">
                    <div className="flex items-center sm:mb-0">
                        <p className="text-lg font-semibold text-gray-900 mr-2">Your code:</p>
                        <button
                            className="flex items-center px-2 py-1 bg-gray-100 border rounded-lg hover:bg-gray-200 transition duration-200"
                            onClick={() => {
                                alert('Referral code copied to clipboard!');
                            }}
                        >
                            <span className="mr-2">A1B2C3</span>
                            <FaClipboard className="text-gray-900" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                    <div className="stats shadow-sm bg-white p-2 text-center">
                        <div className="stat">
                            <div className="stat-title text-sm text-houseBlue font-semibold">Lifetime Referrals</div>
                            <div className="stat-value text-xl font-bold text-black">{referralCount}</div>
                        </div>
                    </div>
                    <div className="stats shadow-sm bg-white p-2 text-center">
                        <div className="stat">
                            <div className="stat-title text-sm text-houseBlue font-semibold">Total Rewards Claimed</div>
                            <div className="stat-value text-xl font-bold text-black">{totalRewardsClaimed}</div>
                        </div>
                    </div>
                </div>
                <div className="text-center relative group p-4">
                    <h3 className="hidden lg:block text-lg font-semibold text-gray-900">
                        {availableRewards > 0
                            ? discountApplied
                                ? 'Discount already active. You can claim again after discount is over.'
                                : 'You have rewards to claim!'
                            : 'No rewards available at the moment.'}
                    </h3>

                    <button
                        type="button"
                        onClick={() => setIsTimelineOpen(true)}
                        className={`mt-2 inline-block text-white py-2 px-4 rounded-md w-48 transition duration-200 ${availableRewards <= 0 || discountApplied ? 'bg-gray-300 cursor-not-allowed' : 'bg-houseBlue hover:bg-houseHoverBlue'
                            }`}
                        disabled={availableRewards <= 0 || discountApplied}
                    >
                        Claim Rewards
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileReferralData;
