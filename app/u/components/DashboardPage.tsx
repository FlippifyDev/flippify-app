import React from 'react';
import DashboardOverviewCard from './DashboardOverviewCard';
import DashboardRecentSalesCard from './DashboardRecentSalesCard';
import DashboardProfitsGraph from './DashboardProfitsGraph';
import DashboardCustomerFeedbackCard from './DashboardCustomerFeedbackCard';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <DashboardOverviewCard />
      </div>
      <div className="flex mb-4">
        <div className="w-2/3 pr-2">
          <DashboardRecentSalesCard />
        </div>
        <div className="w-1/3 pl-2">
          <DashboardCustomerFeedbackCard />
        </div>
      </div>
      <div className="w-full mt-4">
        <DashboardProfitsGraph />
      </div>
    </div>
  );
};

export default Dashboard;
