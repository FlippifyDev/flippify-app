'use client';

import React, { useEffect, useState } from "react";
import UserLayout from "./UserLayout";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../api/firebaseConfig';
import { User, IUser } from '../../api/userModel';
import { Types } from 'mongoose';

const WaitlistStatus: React.FC = () => {
  const [position, setPosition] = useState<number>(0);
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const fetchWaitlistStatus = async () => {
        const discordId = Types.Long.fromString(user.uid);
        const userDetails = await User.findOne({ discord_id: discordId });

        if (userDetails) {
          setPosition(userDetails.position);
          setReferralCode(userDetails.referralCode);
          setReferralCount(userDetails.referralCount);
        }
      };

      fetchWaitlistStatus();
    }
  }, [user]);

  const handleReferFriend = () => {
    // Implement referral logic here
  };

  return (
    <UserLayout>
      <div className="bg-white py-8 rounded-3xl shadow-md border-2 border-gray-500">
        <p className="text-5xl font-bold text-center text-gray-900 mb-4">
          You're on the Waitlist!
        </p>
        <p className="text-lg text-gray-700 text-center mb-8">
          Your position in the queue: {position}
        </p>
        <p className="text-lg text-gray-700 text-center mb-8">
          Referral Code: {referralCode}
        </p>
        <p className="text-lg text-gray-700 text-center mb-8">
          Friends Referred: {referralCount}
        </p>
        <div className="flex justify-center">
          <button
            className="bg-houseBlue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
            onClick={handleReferFriend}
          >
            Refer a Friend
          </button>
        </div>
      </div>
    </UserLayout>
  );
};

export default WaitlistStatus;
