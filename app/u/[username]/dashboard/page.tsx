"use client";

import React from 'react';
import Layout from '../../components/Layout';
import DashboardPage from '../../components/DashboardPage';
import LayoutSubscriptionWrapper from '../../components/LayoutSubscriptionWrapper';
import WaitlistContent from '../../components/WaitlistContent';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Manage Your Reselling Efficiently - Flippify Dashboard</title>
        <meta name="description" content="Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface." />
        <meta property="og:title" content="Manage Your Reselling Efficiently - Flippify Dashboard" />
        <meta property="og:description" content="Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface." />
        <meta property="og:url" content="https://flippify.co.uk/dashboard" />
        <meta property="og:image" content="https://i.imgur.com/dashboard.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="light" />
      <Layout>
        <div className="w-full h-full">
          <LayoutSubscriptionWrapper requiredSubscriptions={['standard']}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>
          <LayoutSubscriptionWrapper requiredSubscriptions={['!whitelisted']}>
            <WaitlistContent />
          </LayoutSubscriptionWrapper>
          <LayoutSubscriptionWrapper requiredSubscriptions={['whitelisted', '!standard', '!server']}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>
        </div>
      </Layout>
    </>
  );
}
