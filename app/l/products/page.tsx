"use client";

import React from 'react';
import Layout from '../components/Layout';
import ProductsPageContent from '../components/ProductsPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '../../components/ThemeSetter';

export default function ProductsPage() {
  return (
    <>
      <Head>
        <title>Exclusive Flipping Products - Flippify Deals</title>
        <meta name="description" content="Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers." />
        <meta property="og:title" content="Exclusive Flipping Products - Flippify Deals" />
        <meta property="og:description" content="Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers." />
        <meta property="og:url" content="https://flippify.co.uk/l/products" />
        <meta property="og:image" content="https://i.imgur.com/iofmtlb.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <ProductsPageContent />
        </Layout>
      </Suspense>
    </>
  );
}
