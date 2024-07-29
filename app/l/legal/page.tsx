"use client";

import React, { useEffect } from 'react';
import LegalContent from '@/app/components/LegalContent';
import Layout from '../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '../../components/ThemeSetter';

// Metadata for the Legal Page
const metadata = {
  title: 'Flippify Legal Info - Privacy & Terms',
  description: 'Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform.',
  openGraph: {
    title: 'Flippify Legal Info - Privacy & Terms',
    description: 'Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform.',
    url: 'https://flippify.co.uk/legal',
    images: [
      {
        url: 'https://i.imgur.com/legal.png',
        width: 1908,
        height: 1076,
        alt: 'Legal Page Image'
      }
    ]
  },
  robots: "index,follow"
};

export default function Legal() {
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
          <LegalContent />
        </Layout>
      </Suspense>
    </>
  );
}
