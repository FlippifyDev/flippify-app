import React from 'react';
import LayoutSubscriptionWrapper from "../../components/LayoutSubscriptionWrapper";
import WaitlistContent from "../../components/WaitlistContent";
import DashboardPage from "../../components/DashboardPage";
import Layout from "../../components/Layout";
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

// Metadata for the Dashboard Page
const metadata = {
  title: "Manage Your Reselling Efficiently - Flippify Dashboard",
  description: "Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.",
  openGraph: {
    title: "Manage Your Reselling Efficiently - Flippify Dashboard",
    description: "Experience the Flippify dashboard, designed for efficiency and effectiveness. Track your reselling activities, monitor deals, and maximize your profits with our user-friendly interface.",
    url: 'https://flippify.co.uk/dashboard',
    images: [
      {
        url: 'https://i.imgur.com/dashboard.png',
        width: 1908,
        height: 1076,
        alt: 'Dashboard Page Image'
      }
    ]
  },
  robots: "index,follow"
};

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="light" />
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </>
  );
}
