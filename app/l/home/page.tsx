"use client";

import React from 'react';
import Layout from '../components/Layout';
import HomeContentWrapperPage from '../components/HomeContentWrapperPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '../../components/ThemeSetter';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Transform Your Reselling Game - Flippify Home</title>
        <meta name="description" content="Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative." />
        <meta property="og:title" content="Transform Your Reselling Game - Flippify Home" />
        <meta property="og:description" content="Welcome to Flippify, your ultimate reselling platform for flipping, buying, and selling unique items. Boost your profits with our fast deal bots, covering everything from Lego to sneakers. Learn how Flippify makes reselling easy and lucrative." />
        <meta property="og:url" content="https://flippify.co.uk/l/home" />
        <meta property="og:image" content="https://i.imgur.com/iofmtlb.png" />
        <meta name="robots" content="index, follow" />
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
