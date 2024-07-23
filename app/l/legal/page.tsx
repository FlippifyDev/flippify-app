// Local Imports
import LegalContent from '@/app/components/LegalContent';
import Layout from '../components/Layout';
import Loading from '@/app/components/Loading';

import { Metadata } from 'next';
import { Suspense } from 'react';



export const metadata: Metadata = {
  title: 'Flippify Legal Information - Privacy & Terms',
  description: 'Access Flippify’s comprehensive legal information, including our Privacy Policy and Terms and Conditions. Stay informed about our practices, your rights, and our dedication to protecting your data and ensuring fair trading.',
  robots: "index,follow"
}


export default function Legal() {
  return (
    <Suspense fallback={<Loading />}>
      <Layout>
        <LegalContent />
      </Layout>
    </Suspense>
  );
}