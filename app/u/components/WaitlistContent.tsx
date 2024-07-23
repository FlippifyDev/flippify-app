"use client";

import LayoutSubscriptionWrapper from "./LayoutSubscriptionWrapper";
import WaitlistJoinStatus from "./WaitlistJoinStatus";
import WaitlistJoinForm from "./WaitlistJoinForm";

import { useSession } from 'next-auth/react';

const WaitListContent: React.FC = () => {
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
            <WaitlistJoinStatus 
              position={waitlisted?.position || 0} 
              referralCode={referral ? referral.referral_code || "N/A" : "N/A"} 
              referralCount={referral ? referral.referral_count || 0 : 0} 
            />
          </div>
        ) : (
          <LayoutSubscriptionWrapper requiredSubscriptions={['!whitelisted', '!waiting']}>
            <div className="flex items-center justify-center">
              <WaitlistJoinForm />
            </div>
          </LayoutSubscriptionWrapper>
        )
      ) : (
        <div className="mb-6 text-center text-gray-700">
          Please log in to access your waitlist status.
        </div>
      )}
    </div>
  );
};

export default WaitListContent;
