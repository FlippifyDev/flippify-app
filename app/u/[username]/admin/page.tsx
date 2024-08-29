import React from 'react';
import UserLayout from '../../components/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import AdminContent from '../../components/AdminContent';

export const metadata = {
  title: 'Admin - Flippify',
  description: 'Admin page for managing users and subscriptions.',
};

export default function Admin() {
  return (
    <>
      <ThemeSetter theme="light" />
      <UserLayout>
        <AdminContent />
      </UserLayout>
    </>
  );
}
