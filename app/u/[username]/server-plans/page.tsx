import React from 'react';
import ServerPlansPage from '../../components/ServerPlansPage';
import Layout from '../../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

// Metadata for the Server Plans Page
const metadata = {
  title: 'User - Server Plans',
  description: 'Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits.',
  openGraph: {
    title: 'User - Server Plans',
    description: 'Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits.',
    url: 'https://flippify.co.uk/server-plans',
    images: [
      {
        url: 'https://i.imgur.com/server-plans.png',
        width: 1908,
        height: 1076,
        alt: 'Server Plans Page Image'
      }
    ]
  },
  robots: "index,follow"
};

const ServerPlans = () => {
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
          <ServerPlansPage />
        </Layout>
      </Suspense>
    </>
  );
};

export default ServerPlans;
