"use client";

import SubscriptionWrapper from "./SubscriptionWrapper";
import WaitlistStatus from "./WaitlistStatus";
import WaitlistForm from "./WaitlistForm";

import { useSession } from 'next-auth/react';

const WaitListedContent: React.FC = () => {
  const { data: session, status } = useSession();

  // Determine if user is authenticated
  const isAuthenticated = status === 'authenticated';
  const waitlisted = isAuthenticated && session?.user?.waitlisted;
  const referral = isAuthenticated && session?.user?.referral;

  return (
    <div>
      {isAuthenticated ? (
        waitlisted ? (
          <div className="mb-6">
            <WaitlistStatus 
              position={waitlisted?.position || 0} 
              referralCode={referral ? referral.referral_code || "N/A" : "N/A"} 
              referralCount={referral ? referral.referral_count || 0 : 0} 
            />
          </div>
        ) : (
          <SubscriptionWrapper requiredSubscriptions={['!whitelisted', '!waiting']}>
            <div className="flex items-center justify-center">
              <WaitlistForm />
            </div>
          </SubscriptionWrapper>
        )
      ) : (
        <div className="mb-6 text-center text-gray-700">
          Please log in to access your waitlist status.
        </div>
      )}
    </div>
  );
};

export default WaitListedContent;
