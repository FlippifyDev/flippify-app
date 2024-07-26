"use client";

import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import HomeContentWrapperPage from '../components/HomeContentWrapperPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import { generateMetadata } from '@/app/components/metadata';
import { pageMetadata } from '@/app/components/metadataConfig';
import Head from 'next/head';

const metadata = generateMetadata(pageMetadata.home);

export default function HomePage() {
  useEffect(() => {
    // Set the theme to dark mode for this page
    document.documentElement.setAttribute('data-theme', 'dark');
    // Cleanup function to reset theme when the component unmounts
    return () => {
      document.documentElement.removeAttribute('data-theme');
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
        {typeof metadata.robots === 'string' ? (
          <meta name="robots" content={metadata.robots} />
        ) : (
          <>
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
          </>
        )}
      </Head>
      <Suspense fallback={<Loading />}>
        <Layout>
          <HomeContentWrapperPage />
        </Layout>
      </Suspense>
    </>
  );
}
