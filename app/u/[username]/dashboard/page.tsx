import SubscriptionWrapper from "../../components/SubscriptionWrapper";
import UserLayout from "../../components/UserLayout";
import WaitListedContent from "../../components/WaitListedContent";

import React from "react";
import { Metadata } from "next";
import DashboardContent from "../../components/DashboardContent";


export const metadata: Metadata = {
  title: "Manage Your Reselling Efficiently - Flippify Dashboard",
  description:
    "Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.",
};

const DashboardPage = () => {

  return (
    <UserLayout>
      <div className="p-4">
      <SubscriptionWrapper requiredSubscriptions={['standard']}>
        <DashboardContent />
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
