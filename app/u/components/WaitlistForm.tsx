'use client';

import React, { useState } from "react";
import UserLayout from "./UserLayout";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../api/firebaseConfig';
import { joinWaitlist } from '../../api/joinWaitlist';

const WaitlistForm: React.FC = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [user] = useAuthState(auth);

  const handleJoinWaitlist = async () => {
    if (user) {
      await joinWaitlist(user.uid, user.displayName || '', referralCode || null);
      console.log("User joined the waitlist.");
    } else {
      console.log("User not authenticated.");
    }
  };

  return (
    <UserLayout>
      <div className="bg-white py-8 rounded-3xl shadow-md border-2 border-gray-500">
        <p className="text-5xl font-bold text-center text-gray-900 mb-4">
          Join our
          <span className="text-5xl text-gradient bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {" "}Waitlist
          </span>
        </p>
        <p className="text-lg text-gray-700 text-center mb-8 mr-4 ml-4">
          Gain a discounted early access to our All-In-One service specifically designed to take you from nothing to a full-time reseller.
        </p>
        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Referral Code (optional)"
            className="input input-bordered w-1/2"
          />
        </div>
        <div className="flex justify-center">
          <button
            className="bg-houseBlue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
            onClick={handleJoinWaitlist}
          >
            Join Waitlist
          </button>
        </div>
        <p className="text-sm text-gray-600 text-center mt-4">
          Limited spots available! Reserve yours now.
        </p>
      </div>
    </UserLayout>
  );
};

export default WaitlistForm;
