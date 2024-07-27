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
