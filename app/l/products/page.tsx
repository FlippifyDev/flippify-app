import React from 'react';
import ProductContent from "../components/ProductsPage";
import Layout from '../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import Head from 'next/head';
import ThemeSetter from '../../components/ThemeSetter';

// Metadata for the Products Page
const metadata = {
  title: 'Exclusive Flipping Products - Flippify Deals',
  description: 'Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers.',
  openGraph: {
    title: 'Exclusive Flipping Products - Flippify Deals',
    description: 'Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers.',
    url: 'https://flippify.co.uk/l/products',
    images: [
      {
        url: 'https://i.imgur.com/iofmtlb.png',
        width: 1908,
        height: 1076,
        alt: 'Products Page Image'
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Products() {
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
        <meta name="googlebot" content="index, follow, noimageindex, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      </Head>
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <ProductContent />
        </Layout>
      </Suspense>
    </>
  );
}
