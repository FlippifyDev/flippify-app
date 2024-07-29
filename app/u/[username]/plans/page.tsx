import React from 'react';
import UserLayout from '../../components/Layout';
import PlansPageContent from '../../components/PlansPage';
import MetadataHead from '@/app/components/MetadataHead';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'Flexible Pricing Plans for Resellers - Flippify',
  description: 'Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits.',
  openGraph: {
    title: 'Flexible Pricing Plans for Resellers - Flippify',
    description: 'Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits.',
    url: 'https://flippify.co.uk/plans',
    images: [
      {
        url: 'https://i.imgur.com/plans.png',
        width: 1908,
        height: 1076,
        alt: 'Plans Page Image'
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

export default function Plans() {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="light" />
      <UserLayout>
        <PlansPageContent />
      </UserLayout>
    </>
  );
}
