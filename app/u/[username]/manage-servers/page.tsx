"use client";

import React from 'react';
import UserLayout from '../../components/Layout';
import ManageServersPage from '../../components/ManageServersPage';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

export default function ManageServers() {
  return (
    <>
      <Head>
        <title>Manage Your Servers - Flippify</title>
        <meta name="description" content="Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities." />
        <meta property="og:title" content="Manage Your Servers - Flippify" />
        <meta property="og:description" content="Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities." />
        <meta property="og:url" content="https://flippify.co.uk/manage-servers" />
        <meta property="og:image" content="https://i.imgur.com/manage-servers.png" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ThemeSetter theme="light" />
      <UserLayout>
        <ManageServersPage />
      </UserLayout>
    </>
  );
}
