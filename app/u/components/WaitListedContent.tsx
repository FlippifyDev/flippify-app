"use client"

import SubscriptionWrapper from "./SubscriptionWrapper";
import WaitlistStatus from "./WaitlistStatus";
import WaitlistForm from "./WaitlistForm";

import { useSession } from 'next-auth/react';



const WaitListedContent: React.FC = () => {
    const { data: session, status } = useSession();
  
    // Determine if user is authenticated
    const isAuthenticated = status === 'authenticated';
    const isWaitlisted = isAuthenticated && session?.user?.waitlisted;
  
    return (
      <div>
        {isAuthenticated ? (
          isWaitlisted ? (
            <div className="mb-6">
              <WaitlistStatus 
                position={isWaitlisted.position || 0} 
                referralCode={isWaitlisted.referral_code || "N/A"} 
                referralCount={isWaitlisted.referral_count || 0} 
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
