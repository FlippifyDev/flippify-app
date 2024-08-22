'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { ref, get } from 'firebase/database';
import { updateUserInFirebase } from '@/app/api/auth-firebase/firebaseConfig';
import { database } from '@/app/api/auth-firebase/firebaseConfig';
import { completeOnboarding } from '@/app/api/auth-mongodb/completeOnboarding';

const OnboardingFlow: React.FC = () => {
  const [step, setStep] = useState(1);
  const [referralCode, setReferralCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');
  const { data: session } = useSession();

  useEffect(() => {
    const loadUserData = async () => {
      if (session && session.user) {
        const customerId = session.user.customerId as string;
        const userRef = ref(database, `users/${customerId}`);

        try {
          const snapshot = await get(userRef);
          const userData = snapshot.val();

          if (userData?.preferredEmail) {
            setEmail(userData.preferredEmail);
          } else {
            setEmail(session.user.email || '');
          }

          const userCurrency = userData?.currency || session.user.currency || 'GBP';
          setCurrency(userCurrency);
        } catch (error) {
          console.error('Error loading user data from Firebase:', error);
          setEmail(session.user.email || '');
          setCurrency(session.user.currency || 'GBP');
        }
      }
    };

    loadUserData();
  }, [session]);

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const handleCompleteOnboarding = async () => {
    if (session?.user) {
      const customerId = session.user.customerId as string;
      await updateUserInFirebase(customerId, email, currency, 'preferredEmail');
      
      // Complete onboarding
      await completeOnboarding(session.user.id);

      // Refresh the session to reflect the updated roles
      const result = await signIn('credentials', { redirect: false });

      if (result?.ok) {
        // Only reload the page on the client side
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      } else {
        console.error('Error refreshing session:', result?.error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white py-8 px-6 rounded-3xl shadow-md border-2 max-w-lg w-full">
        {step === 1 && (
          <>
            <section className="text-center">
              <h2 className="text-5xl font-bold mb-4">
                Welcome to
              </h2>
              <h2 className="text-5xl font-bold mb-4 text-gradient bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Flippify
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Join now and take the first step to becoming a full-time reseller.
              </p>
              <div className="mb-6">
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Referral Code (optional)"
                  className="input input-bordered w-full"
                  aria-label="Referral Code"
                  aria-required="false"
                />
              </div>
              <button
                className="btn btn-primary bg-houseBlue text-white hover:bg-blue-600 w-full"
                onClick={handleNextStep}
              >
                Next
              </button>
            </section>
          </>
        )}
        {step === 2 && (
          <>
            <section className="text-center">
              <div className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Contact Email"
                  className="input input-bordered w-full"
                  aria-label="Contact Email"
                  aria-required="true"
                />
              </div>
              <div className="mb-6">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'GBP' | 'USD' | 'EUR')}
                  className="input input-bordered w-full"
                  aria-label="Preferred Currency"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <button
                className="btn btn-primary bg-houseBlue text-white hover:bg-blue-600 w-full"
                onClick={handleCompleteOnboarding}
              >
                Get Access
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
