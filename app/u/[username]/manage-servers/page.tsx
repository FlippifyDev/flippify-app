import React from 'react';
import UserLayout from '../../components/Layout';
import ManageServersPage from '../../components/ManageServersPage';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'Manage Your Servers - Flippify',
  description: 'Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities.',
};

export default function ManageServers() {
  return (
    <>
      <ThemeSetter theme="light" />
      <UserLayout>
        <ManageServersPage />
      </UserLayout>
    </>
  );
}
