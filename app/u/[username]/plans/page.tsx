import React from 'react';
import UserLayout from '../../components/Layout';
import PlansPageContent from '../../components/PlansPage';
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'User Plans - Flippify',
  description: 'Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits.',
};

export default function Plans() {
  return (
    <>
      <ThemeSetter theme="light" />
      <UserLayout>
        <PlansPageContent />
      </UserLayout>
    </>
  );
}
