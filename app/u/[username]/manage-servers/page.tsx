import React from 'react';
import Layout from '../../components/layout/Layout';
import ManageServersPage from '../../components/tool-manage-servers/ManageServersPage';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'Manage Your Servers - Flippify',
  description: 'Easily manage all your servers with Flippify. Monitor server activity, track performance, and ensure optimal reselling opportunities.',
};

export default function ManageServers() {
  return (
    <>
      <ThemeSetter theme="light" />
      <Layout anySubscriptions={['server', 'admin']}>
        <ManageServersPage />
      </Layout>
    </>
  );
}
