"use client";

import React from 'react';
import UserLayout from '../../components/Layout';
import PlansPageContent from '../../components/PlansPage';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

export default function Plans() {
  return (
    <>
      <Head>
        <title>Flexible Pricing Plans for Resellers - Flippify</title>
        <meta name="description" content="Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits." />
        <meta property="og:title" content="Flexible Pricing Plans for Resellers - Flippify" />
        <meta property="og:description" content="Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits." />
        <meta property="og:url" content="https://flippify.co.uk/plans" />
        <meta property="og:image" content="https://i.imgur.com/plans.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="light" />
      <UserLayout>
        <PlansPageContent />
      </UserLayout>
    </>
  );
}
