import React from 'react';
import DashboardOverviewCard from './DashboardOverviewCard';
import DashboardSalesTrendsCard from './DashboardProfitsGraph';
import DashboardRecentSalesCard from './DashboardRecentSalesCard';
import DashboardCustomerFeedbackCard from './DashboardCustomerFeedbackCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="grid gap-4 grid-cols-12">
      {/* Key Metrics Section */}
      <div className="col-span-12">
        <DashboardOverviewCard />
      </div>

      <div className="col-span-12 lg:col-span-8 flex flex-col">
        {/* Recent Sales Activity Section */}
        <div className="flex-1">
          <DashboardRecentSalesCard />
        </div>

        {/* Customer Feedback Section */}
        <div className="mt-4">
          <DashboardCustomerFeedbackCard />
        </div>
      </div>

      {/* Sales Trends Section */}
      <div className="col-span-12 lg:col-span-4">
        <DashboardSalesTrendsCard />
      </div>
    </div>
  );
};

export default DashboardPage;
