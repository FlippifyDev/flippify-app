"use client";

import React, { useEffect } from "react";
import UserLayout from "../../components/Layout";
import SalesTrackerPage from "../../components/SalesTrackerPage";
import { EstimateProvider } from "../../../components/EstimateContext";
import "../../../../styles/sales-and-profits.css";
import Head from "next/head";
import ThemeSetter from "@/app/components/ThemeSetter";

// Metadata for the Sales Tracker Page
const metadata = {
  title: 'Track Your Sales and Profits - Flippify',
  description: 'Keep track of your sales and profits with Flippify’s comprehensive sales tracker. Monitor your performance and maximize your reselling success.',
  openGraph: {
    title: 'Track Your Sales and Profits - Flippify',
    description: 'Keep track of your sales and profits with Flippify’s comprehensive sales tracker. Monitor your performance and maximize your reselling success.',
    url: 'https://flippify.co.uk/sales-tracker',
    images: [
      {
        url: 'https://i.imgur.com/sales-tracker.png',
        width: 1908,
        height: 1076,
        alt: 'Sales Tracker Page Image'
      }
    ]
  },
  robots: "index,follow"
};

const SalesTracker = () => {
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
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      </Head>
      <ThemeSetter theme="light" />
      <UserLayout>
        <EstimateProvider>
          <SalesTrackerPage />
        </EstimateProvider>
      </UserLayout>
    </>
  );
};

export default SalesTracker;
