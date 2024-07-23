import LayoutSubscriptionWrapper from "../../components/LayoutSubscriptionWrapper";
import WaitlistContent from "../../components/WaitlistContent";
import DashboardPage from "../../components/DashboardPage";
import Layout from "../../components/Layout";

import React from "react";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Manage Your Reselling Efficiently - Flippify Dashboard",
  description:
    "Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.",
};

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-4">
      <LayoutSubscriptionWrapper requiredSubscriptions={['standard']}>
        <DashboardPage />
      </LayoutSubscriptionWrapper>


        {/* FOR PEOPLE WHO ARE NOT WHITELISTED */}
        <LayoutSubscriptionWrapper requiredSubscriptions={['!whitelisted']}>
          <WaitlistContent />
        </LayoutSubscriptionWrapper>

        {/* FOR PEOPLE WITHOUT SUBSCRIPTIONS BUT ARE WHITELISTED*/}
        <LayoutSubscriptionWrapper requiredSubscriptions={['whitelisted', '!standard', '!server']}>
          <DashboardPage />
        </LayoutSubscriptionWrapper>
      </div>
    </Layout>
  );
};

export default Dashboard;
