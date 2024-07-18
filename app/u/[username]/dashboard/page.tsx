import React from "react";
import UserLayout from "../../components/UserLayout";
import { Metadata } from "next";
import SubscriptionWrapper from "../../components/SubscriptionWrapper";
import WaitlistForm from "../../components/WaitlistForm"; 

export const metadata: Metadata = {
  title: "Manage Your Reselling Efficiently - Flippify Dashboard",
  description:
    "Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.",
};

const DashboardPage = () => {
  return (
    <UserLayout>
      <div>
        <SubscriptionWrapper requiredSubscriptions={['whitelisted']}>
        <div>
          <div className="text-2xl text-white font-bold flex justify-center">
            Dashboard
          </div>
          <div className="text-greyText flex justify-center">
            Coming Soon...
          </div>
          <div>
            Have Analytics Section: Visual Charts: Monthly Revenue and Profit
            Chart: Bar graph Top Platforms by Revenue: Pie chart Profit Trends
            Over Time: Line graph Custom Reports: Option to generate custom
            reports based on selected criteria
          </div>
        </div>
        </SubscriptionWrapper>

        <SubscriptionWrapper requiredSubscriptions={['!whitelisted']}>
          <WaitlistForm />
        </SubscriptionWrapper>
      </div>
    </UserLayout>
  );
};

export default DashboardPage;
