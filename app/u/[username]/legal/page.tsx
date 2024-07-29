"use client";

import React from 'react';
import LegalContent from '@/app/components/LegalContent';
import Layout from '../../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '@/app/components/ThemeSetter';

export default function Legal() {
  return (
    <>
      <Head>
        <title>Flippify Legal Info - Privacy & Terms</title>
        <meta name="description" content="Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform." />
        <meta property="og:title" content="Flippify Legal Info - Privacy & Terms" />
        <meta property="og:description" content="Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform." />
        <meta property="og:url" content="https://flippify.co.uk/legal" />
        <meta property="og:image" content="https://i.imgur.com/legal.png" />
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
