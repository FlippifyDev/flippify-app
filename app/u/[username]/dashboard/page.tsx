"use client";

import React, { useEffect } from "react";
import LayoutSubscriptionWrapper from "../../components/LayoutSubscriptionWrapper";
import WaitlistContent from "../../components/WaitlistContent";
import DashboardPage from "../../components/DashboardPage";
import Layout from "../../components/Layout";
import { generateMetadata } from "@/app/components/metadata";
import { pageMetadata } from "@/app/components/metadataConfig";
import Head from "next/head";

const metadata = generateMetadata(pageMetadata.dashboard);

const Dashboard = () => {
  useEffect(() => {
    // Set the theme to light mode for this page
    document.documentElement.setAttribute("data-theme", "light");
    // Cleanup function to reset theme when the component unmounts
    return () => {
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        {typeof metadata.robots === "string" ? (
          <meta name="robots" content={metadata.robots} />
        ) : (
          <>
            <meta name="robots" content="index, follow" />
            <meta
              name="googlebot"
              content="index, follow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
            />
          </>
        )}
      </Head>
      <Layout>
        <div className="w-full h-full">
          <LayoutSubscriptionWrapper requiredSubscriptions={["standard"]}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>

          {/* FOR PEOPLE WHO ARE NOT WHITELISTED */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["!whitelisted"]}>
            <WaitlistContent />
          </LayoutSubscriptionWrapper>

          {/* FOR PEOPLE WITHOUT SUBSCRIPTIONS BUT ARE WHITELISTED */}
          <LayoutSubscriptionWrapper requiredSubscriptions={["whitelisted", "!standard", "!server"]}>
            <DashboardPage />
          </LayoutSubscriptionWrapper>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
