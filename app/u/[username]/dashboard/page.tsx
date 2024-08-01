import React from 'react';
import Layout from '../../components/Layout';
import DashboardPage from '../../components/DashboardPage';
import LayoutSubscriptionWrapper from '../../components/LayoutSubscriptionWrapper';
import WaitlistContent from '../../components/WaitlistContent';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'Dashboard - Flippify',
  description: 'Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.',
};

export default function Dashboard() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout>
        <div className="w-full h-full">
          {/* 
            Please DO NOT CHANGE this logic right now, its a bit odd but works. 
            A small change may result in the dashboard not displaying or may
            result in the dashboard displaying twice.
          */}

          {/* Display dashboard if the user only has a standard subscription */}
          <LayoutSubscriptionWrapper requiredSubscriptions={['standard', '!server']}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>

          {/* Display dashboard if the user only has a server subscription */}
          <LayoutSubscriptionWrapper requiredSubscriptions={['server', '!standard']}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>

          {/* Display dashboard if the user has both standard and server subscription */}
          <LayoutSubscriptionWrapper requiredSubscriptions={['server', 'standard']}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>

          {/* Display the waitlisted card if the user has not been whitelisted */}
          <LayoutSubscriptionWrapper requiredSubscriptions={['!whitelisted']}>
            <WaitlistContent />
          </LayoutSubscriptionWrapper>

          {/* If the user is whitelisted but does not have a subscription then display the dashboard*/}
          <LayoutSubscriptionWrapper requiredSubscriptions={['whitelisted', '!standard', '!server']}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>
        </div>
      </Layout>
    </>
  );
}
