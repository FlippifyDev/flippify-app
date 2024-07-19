import SubscriptionWrapper from "../../components/SubscriptionWrapper";
import UserLayout from "../../components/UserLayout";
import WaitListedContent from "../../components/WaitListedContent";

import React from "react";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Manage Your Reselling Efficiently - Flippify Dashboard",
  description:
    "Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.",
};

const DashboardPage = () => {

  return (
    <UserLayout>
      <div className="p-4">

        {/* FOR PEOPLE WITH SUBSCRIPTIONS */}
        <SubscriptionWrapper requiredSubscriptions={['standard', 'server']}>
          <div className="mb-6">
            <div className="text-2xl text-white font-bold text-center">
              Dashboard
            </div>
            <div className="text-greyText text-center mt-2">
              Coming Soon...
            </div>
            <div className="mt-4">
              Have Analytics Section: Visual Charts: Monthly Revenue and Profit
              Chart: Bar graph Top Platforms by Revenue: Pie chart Profit Trends
              Over Time: Line graph Custom Reports: Option to generate custom
              reports based on selected criteria
            </div>
          </div>
        </SubscriptionWrapper>

        {/* FOR PEOPLE WHO ARE NOT WHITELISTED */}
        <SubscriptionWrapper requiredSubscriptions={['!whitelisted']}>
          <WaitListedContent />
        </SubscriptionWrapper>

        {/* FOR PEOPLE WITHOUT SUBSCRIPTIONS BUT ARE WHITELISTED*/}
        <SubscriptionWrapper requiredSubscriptions={['whitelisted', '!standard', '!server']}>
          <div>
            Test
          </div>
        </SubscriptionWrapper>
      </div>
    </UserLayout>
  );
};

export default DashboardPage;
