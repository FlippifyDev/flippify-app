import React from 'react';
import PricingPage from "../components/PricingPage";
import Layout from '../components/Layout';
import Loading from "@/app/components/Loading";
import { Suspense } from "react";
import Head from 'next/head';
import ThemeSetter from '../../components/ThemeSetter';

// Metadata for the Pricing Page
const metadata = {
  title: 'Affordable Pricing Plans for Resellers - Flippify',
  description: 'Discover Flippify’s pricing plans designed to suit all your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
  openGraph: {
    title: 'Affordable Pricing Plans for Resellers - Flippify',
    description: 'Discover Flippify’s pricing plans designed to suit all your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
    url: 'https://flippify.co.uk/l/pricing',
    images: [
      {
        url: 'https://i.imgur.com/D1UhTq3.png',
        width: 1908,
        height: 1076,
        alt: 'Pricing Page Image'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Pricing() {
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
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <PricingPage />
        </Layout>
      </Suspense>
    </>
  );
}
