import React from 'react';
import Layout from '../components/layout/Layout';
import HomeContentWrapperPage from '../components/home/HomeContentWrapperPage';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';

export const metadata = {
  title: 'Flippify - Deal Finding Bots and Tools for Resellers',
  description: 'The Ultimate platform for resellers to accelerate their profits. Earn more using our top of the range deal finding bots and tools to automate every step of the way, making you more money and finding more deals, quicker.',
  openGraph: {
    title: 'Flippify - Deal Finding Bots and Tools for Resellers',
    description: 'The Ultimate platform for resellers to accelerate their profits. Earn more using our top of the range deal finding bots and tools to automate every step of the way, making you more money and finding more deals, quicker.',
    url: 'https://flippify.co.uk/l/home',
    images: [
      {
        url: "https://i.imgur.com/iofmtlb.png",
        width: 1908,
        height: 1076,
        alt: "Home Page Image"
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
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
      <MetadataHead {...metadata} />
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <HomeContentWrapperPage />
        </Layout>
      </Suspense>
    </>
  );
}
