"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handleUser } from '../../api/firebaseConfig'; 
import DashboardOverviewCard from './DashboardOverviewCard';
import DashboardRecentSalesCard from './DashboardRecentSalesCard';
import DashboardProfitsGraph from './DashboardProfitsGraph';

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
      <div className="w-full">
        <DashboardOverviewCard customerId={userData.customerId} />
      </div>
      <div className="w-full mt-2 mb-2">
      <DashboardProfitsGraph customerId={userData.customerId} />
      </div>
      <div className="w-full">
        <DashboardRecentSalesCard customerId={userData.customerId} />
      </div>
    </div>
  );
};

export default DashboardPage;



/*

import React from 'react';
import DashboardOverviewCard from './DashboardOverviewCard';
import DashboardRecentSalesCard from './DashboardRecentSalesCard';
import DashboardProfitsGraph from './DashboardProfitsGraph';


const Dashboard = () => {
  return (
    <div className="flex flex-col w-full h-full">
    <div className="w-full">
    <DashboardOverviewCard />
    </div>
    <div className="w-full mt-2 mb-2">
    <DashboardProfitsGraph />
    </div>
    <div className="w-full">
    <DashboardRecentSalesCard />
    </div>
    </div>
  );
};

export default Dashboard;

*/