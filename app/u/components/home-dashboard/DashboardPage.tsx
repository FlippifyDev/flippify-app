'use client';

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleUser } from '../../../api/auth-firebase/firebaseConfig'; 

import DashboardServerSubscription from "./DashboardServerSubscription";
import LayoutSubscriptionWrapper from "../layout/LayoutSubscriptionWrapper";
import DashboardRecentSalesCard from './DashboardRecentSalesCard';
import DashboardNoSubscription from "./DashboardNoSubscription";
import DashboardOverviewCard from './DashboardOverviewCard';
import DashboardProfitsGraph from './DashboardProfitsGraph';
import LayoutLoadingSkeleton from "../layout/LayoutLoadingSkeleton";
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
    return <LayoutLoadingSkeleton />;
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
        <div className="flex flex-col lg:flex-row my-4 md:my-11 mx-2 md:mx-6 py-2 md:py-4 md:px-8 bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <div className="lg:w-1/3">
            <DashboardNoSubscription username={session.user.username} />
          </div>
          <div className="lg:w-2/3">
            <DashboardShowcase />
          </div>
        </div>
      </LayoutSubscriptionWrapper>

      {/* If They Have Subscription */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['standard']}> 
        <div className="w-full">
          <DashboardOverviewCard customerId={userData.customerId} />
        </div>
        <div className="w-full mt-2 mb-2">
          <DashboardProfitsGraph customerId={userData.customerId} />
        </div>
        <div className="w-full">
          <DashboardRecentSalesCard customerId={userData.customerId} />
        </div>
      </LayoutSubscriptionWrapper>

      {/* If They Have Subscription */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['server']}> 
        <div className="w-full">
          <DashboardServerSubscription customerId={userData.customerId} />
        </div>
      </LayoutSubscriptionWrapper>
    </div>
  );
};

export default DashboardPage;
