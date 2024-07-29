import React from 'react';
import UserLayout from '../../components/Layout';
import ServerPlansPageContent from '../../components/ServerPlansPage';
import MetadataHead from '@/app/components/MetadataHead';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'User - Server Plans',
  description: 'Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits.',
  openGraph: {
    title: 'User - Server Plans',
    description: 'Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits.',
    url: 'https://flippify.co.uk/server-plans',
    images: [
      {
        url: 'https://i.imgur.com/server-plans.png',
        width: 1908,
        height: 1076,
        alt: 'Server Plans Page Image'
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

export default function ServerPlans() {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="light" />
      <UserLayout>
        <ServerPlansPageContent />
      </UserLayout>
    </>
  );
}
