"use client";

import React from 'react';
import UserLayout from '../../components/Layout';
import ServerPlansPageContent from '../../components/ServerPlansPage';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

export default function ServerPlans() {
  return (
    <>
      <Head>
        <title>User - Server Plans</title>
        <meta name="description" content="Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits." />
        <meta property="og:title" content="User - Server Plans" />
        <meta property="og:description" content="Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits." />
        <meta property="og:url" content="https://flippify.co.uk/server-plans" />
        <meta property="og:image" content="https://i.imgur.com/server-plans.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="light" />
      <UserLayout>
        <ServerPlansPageContent />
      </UserLayout>
    </>
  );
}
