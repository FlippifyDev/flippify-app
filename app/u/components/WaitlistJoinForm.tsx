'use client';

import { joinWaitlist } from '../../api/auth-mongodb/joinWaitlist';

import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

const WaitlistJoinForm: React.FC = () => {
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data: session } = useSession();

  // Effect to reload page on success
  useEffect(() => {
    if (success) {
      window.location.reload(); // Reload the page on success
    }
  }, [success]);

  const handleJoinWaitlist = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (session?.user) {
      if (session.user.customerId) {
        try {
          const result = await joinWaitlist(session, referralCode);
          if (result === null) {
            setSuccess("Successfully joined the waitlist!");
          } else {
            setError(result);
          }
        } catch (err) {
          setError("Failed to join the waitlist. Please try again later.");
        }
      } else {
        setError("No customer ID found.");
      }
    } else {
      setError("User not authenticated.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white py-8 px-6 rounded-3xl shadow-md border-2 max-w-lg sm:max-w-sm mx-auto h-[36rem]">
      <section className="mb-6">
        <p className="text-5xl font-bold text-center text-gray-900 mb-4">
          Join our
          <span className="text-5xl text-gradient bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {" "}Waitlist
          </span>
        </p>
        <p className="text-lg text-gray-700 text-center mb-8">
          Gain a discounted early access to our All-In-One service specifically designed to take you from nothing to a full-time reseller.
        </p>
      </section>
      <section>
        {success && <p className="text-green-500 font-bold text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 font-bold text-center mb-4">{error}</p>}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Referral Code (optional)"
            className="input input-bordered w-full bg-white"
            aria-label="Referral Code"
            aria-required="false"
          />
        </div>
        <div className="flex justify-center">
          <button
            className={`bg-houseBlue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleJoinWaitlist}
            disabled={loading}
            aria-label="Join Waitlist"
          >
            {loading ? 'Joining...' : 'Join Waitlist'}
          </button>
        </div>
        <p className="text-sm text-gray-600 text-center mt-4">
          Limited spots available! Reserve yours now.
        </p>
      </section>
    </div>
  );
};

export default WaitlistJoinForm;
