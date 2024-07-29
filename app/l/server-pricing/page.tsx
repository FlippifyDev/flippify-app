import React from 'react';
import ServerPricingPage from "../components/ServerPricingPage";
import Layout from '../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '../../components/ThemeSetter';

// Metadata for the Server Pricing Page
const metadata = {
  title: 'Affordable Pricing Plans for Server Resellers - Flippify',
  description: 'Discover Flippify’s pricing plans designed to suit all your servers reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
  openGraph: {
    title: 'Affordable Pricing Plans for Server Resellers - Flippify',
    description: 'Discover Flippify’s pricing plans designed to suit all your servers reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.',
    url: 'https://flippify.co.uk/l/server-pricing',
    images: [
      {
        url: 'https://i.imgur.com/u1wNw7N.png',
        width: 1908,
        height: 1076,
        alt: 'Server Pricing Page Image'
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

export default function ServerPricing() {
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
          <ServerPricingPage />
        </Layout>
      </Suspense>
    </>
  );
}
