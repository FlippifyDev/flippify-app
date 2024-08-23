"use client"

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleUser } from '../../api/auth-firebase/firebaseConfig'; 
import LayoutSubscriptionWrapper from "./LayoutSubscriptionWrapper";
import DashboardNoSubscription from "./DashboardNoSubscription";
import DashboardShowcase from "./DashboardShowcase";
import OnboardingFlow from "./OnboardingFlow";

const DashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<{ uid: string; customerId: string } | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session && session.user && session.user.customerId) {
      const fetchUserData = async () => {
        try {
          const customerId = session.user.customerId;
          const filteredCustomerId = customerId?.replace("cus_", "")
          const data = await handleUser(filteredCustomerId as string);
          setUserData(data);
        } catch (error) {
          console.error('Error handling user:', error);
        }
      };
      fetchUserData();
    }
  }, [session]);

  if (!session || !session.user || !session.user.customerId || !userData) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* If They Do NOT Have Access */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['!accessGranted']}> 
        <div className="h-full">
          <OnboardingFlow />
        </div>
      </LayoutSubscriptionWrapper>

      {/* If They Have Access but NO Subscription */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['accessGranted', '!standard', '!server']}>
        <div className="flex flex-col lg:flex-row gap-4 pt-6 p-4 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
          <div className="lg:w-1/3">
            <DashboardNoSubscription username={session.user.username} />
          </div>
          <div className="lg:w-2/3">
            <DashboardShowcase />
          </div>
        </div>
      </LayoutSubscriptionWrapper>
    </div>
  );
};

export default DashboardPage;
