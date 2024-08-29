import React from 'react';
import UserLayout from '../../components/Layout';
import ServerPlansPageContent from '../../components/ServerPlansPage';3
import ThemeSetter from '@/app/components/ThemeSetter';

export const metadata = {
  title: 'Server Plans - Flippify',
  description: 'Explore our pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits.',
};

export default function ServerPlans() {
  return (
    <>
      <ThemeSetter theme="light" />
      <UserLayout>
        <ServerPlansPageContent />
      </UserLayout>
    </>
  );
}
