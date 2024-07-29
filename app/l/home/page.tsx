import React from 'react';
import Layout from '../components/Layout';
import HomeContentWrapperPage from '../components/HomeContentWrapperPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

// Metadata for the Home Page
const metadata = {
  title: 'Transform Your Reselling Game - Flippify Home',
  description: 'Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative.',
  openGraph: {
    title: 'Transform Your Reselling Game - Flippify Home',
    description: 'Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative.',
    url: 'https://flippify.co.uk/l/home',
    images: [
      {
        url: 'https://i.imgur.com/iofmtlb.png',
        width: 1908,
        height: 1076,
        alt: 'Home Page Image'
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

export default function HomePage() {
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
          <HomeContentWrapperPage />
        </Layout>
      </Suspense>
    </>
  );
}
