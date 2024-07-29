import React from 'react';
import UserLayout from '../../components/Layout';
import ManageServersPage from '../../components/ManageServersPage';
import MetadataHead from '@/app/components/MetadataHead';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'Manage Your Servers - Flippify',
  description: 'Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities.',
  openGraph: {
    title: 'Manage Your Servers - Flippify',
    description: 'Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities.',
    url: 'https://flippify.co.uk/manage-servers',
    images: [
      {
        url: 'https://i.imgur.com/manage-servers.png',
        width: 1908,
        height: 1076,
        alt: 'Manage Servers Page Image'
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

export default function ManageServers() {
  return (
    <>
      <MetadataHead {...metadata} />
      <ThemeSetter theme="light" />
      <UserLayout>
        <ManageServersPage />
      </UserLayout>
    </>
  );
}
