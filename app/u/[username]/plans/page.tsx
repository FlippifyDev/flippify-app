import React from 'react';
import PlansPage from "../../components/PlansPage";
import Layout from '../../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

// Metadata for the Plans Page
const metadata = {
  title: 'Flexible Pricing Plans for Resellers - Flippify',
  description: 'Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits.',
  openGraph: {
    title: 'Flexible Pricing Plans for Resellers - Flippify',
    description: 'Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits.',
    url: 'https://flippify.co.uk/plans',
    images: [
      {
        url: 'https://i.imgur.com/plans.png',
        width: 1908,
        height: 1076,
        alt: 'Plans Page Image'
      }
    ]
  },
  robots: "index,follow"
};

const Plans = () => {
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
          <PlansPage />
        </Layout>
      </Suspense>
    </>
  );
};

export default Plans;
