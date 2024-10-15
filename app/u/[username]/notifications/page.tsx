import React from 'react';
import Layout from '../../components/layout/Layout';
import ThemeSetter from '@/app/components/ThemeSetter';
import NotificationsContent from '../../components/home/notifications/NoitificationsContent';

export const metadata = {
  title: 'Legal Info - Flippify',
  description: 'Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform.',
};

export default function Legal() {
  return (
    <>
      <ThemeSetter theme="light" />
        <Layout requiredSubscriptions={['']}>
          <NotificationsContent />
        </Layout>
    </>
  );
}
