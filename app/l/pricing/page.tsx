"use client";

import React from 'react';
import Layout from '../components/Layout';
import PricingPageContent from '../components/PricingPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '../../components/ThemeSetter';

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Affordable Pricing Plans for Resellers - Flippify</title>
        <meta name="description" content="Discover Flippify’s pricing plans designed to suit all your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game." />
        <meta property="og:title" content="Affordable Pricing Plans for Resellers - Flippify" />
        <meta property="og:description" content="Discover Flippify’s pricing plans designed to suit all your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game." />
        <meta property="og:url" content="https://flippify.co.uk/l/pricing" />
        <meta property="og:image" content="https://i.imgur.com/D1UhTq3.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <PricingPageContent />
        </Layout>
      </Suspense>
    </>
  );
}
