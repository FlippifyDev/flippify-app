import React from 'react';
import LegalContent from '@/app/components/LegalContent';
import Layout from '../../components/Layout';
import Loading from '@/app/components/Loading';
import { Suspense } from 'react';
import MetadataHead from '@/app/components/MetadataHead';
import ThemeSetter from '@/app/components/ThemeSetter';

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

export default function Legal() {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="light" />
      <Suspense fallback={<Loading />}>
        <Layout>
          <LegalContent />
        </Layout>
      </Suspense>
    </>
  );
}
