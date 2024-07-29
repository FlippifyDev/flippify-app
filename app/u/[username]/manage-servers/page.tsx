import React from 'react';
import ManageServersPage from '../../components/ManageServersPage';
import Layout from '../../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

// Metadata for the Manage Servers Page
const metadata = {
  title: 'Manage Your Servers - Flippify',
  description: 'Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities.',
  openGraph: {
    title: 'Manage Your Servers - Flippify',
    description: 'Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities.',
    url: 'https://flippify.co.uk/manage-servers',
    images: [
      {
        url: 'https://i.imgur.com/manage-servers.png',
        width: 1908,
        height: 1076,
        alt: 'Manage Servers Page Image'
      }
    ]
  },
  robots: "index,follow"
};

const ManageServers = () => {
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
          <ManageServersPage />
        </Layout>
      </Suspense>
    </>
  );
};

export default ManageServers;
