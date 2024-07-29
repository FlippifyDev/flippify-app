"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleUser } from '../../api/auth-firebase/firebaseConfig'; 
import DashboardOverviewCard from './DashboardOverviewCard';
import DashboardRecentSalesCard from './DashboardRecentSalesCard';
import DashboardProfitsGraph from './DashboardProfitsGraph';
import LayoutSubscriptionWrapper from "./LayoutSubscriptionWrapper";
import DashboardNoSubscription from "./DashboardNoSubscription";
import DashboardServerSubscription from "./DashboardServerSubscription";

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
      {/* This displays the users content when they have no subscription */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server']}> 
        <DashboardNoSubscription username={session.user.username}/>
      </LayoutSubscriptionWrapper>

      {/* This displays the users server content */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', 'server']}> 
        <div className="flex justify-center">
          <DashboardServerSubscription />
        </div>
      </LayoutSubscriptionWrapper>
      
      {/* This displays the users selling content */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['standard', '!server']}> 
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

      {/* For now if the person has both a server and standard subscription then display the user sales dashboard */}
      <LayoutSubscriptionWrapper requiredSubscriptions={['standard', 'server']}> 
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
    </div>

  );
};

export default DashboardPage;


