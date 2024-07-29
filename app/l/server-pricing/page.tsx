import React from 'react';
import Layout from '../components/Layout';
import ServerPricingPageContent from '../components/ServerPricingPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';

export const metadata = {
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
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ServerPricingPage() {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <ServerPricingPageContent />
        </Layout>
      </Suspense>
    </>
  );
}
