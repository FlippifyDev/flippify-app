import React from 'react';
import Layout from '../components/Layout';
import LegalContent from '../../components/LegalContent';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '../../components/MetadataHead';
import ThemeSetter from '../../components/ThemeSetter';

export const metadata = {
  title: 'Flippify Legal Info - Privacy & Terms',
  description: 'Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform.',
  openGraph: {
    title: 'Flippify Legal Info - Privacy & Terms',
    description: 'Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform.',
    url: 'https://flippify.co.uk/legal',
    images: [
      {
        url: 'https://i.imgur.com/legal.png',
        width: 1908,
        height: 1076,
        alt: 'Legal Page Image'
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

export default function LegalPage() {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="dark" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <LegalContent />
        </Layout>
      </Suspense>
    </>
  );
}
