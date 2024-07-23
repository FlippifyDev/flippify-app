import Layout from '../components/Layout';
import ProductContent from "../components/ProductsPage";
import Loading from '@/app/components/Loading';

import { Suspense } from 'react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Exclusive Flipping Products - Flippify Deals',
  description: 'Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers.',
  openGraph: {
    title: 'Exclusive Flipping Products - Flippify Deals',
    description: 'Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers.',
    url: 'https://flippify.co.uk/l/products',
    images: [
      {
        url: "https://i.imgur.com/iofmtlb.png", // This must change eventually
        width: 1918,
        height: 1078,
        alt: "Products Page Image"
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
}


export default function Products() {
  return (
    <Suspense fallback={<Loading />}>
      <Layout>
        <ProductContent />
      </Layout>
    </Suspense>
  );
}
