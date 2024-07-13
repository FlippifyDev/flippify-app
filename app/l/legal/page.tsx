// Local Imports
import Legal from '@/app/components/Legal';
import LandingLayout from '../components/LandingLayout';
import { Metadata } from 'next';
import Head from 'next/head';


export const metadata: Metadata = {
  title: 'Flippify Legal Information - Privacy & Terms',
  description: 'Access Flippify’s comprehensive legal information, including our Privacy Policy and Terms and Conditions. Stay informed about our practices, your rights, and our dedication to protecting your data and ensuring fair trading.'
}


export default function LegalPage() {
  return (
    <div>
      <Head>
        <meta name="google-site-verification" content="Hho6-HQ44X7tDo2PgIXmXtPOFHsg069qvKUSqF3JfkE" />
        <meta name="robots" content="index, follow" />
      </Head>
    <LandingLayout>
      <Legal />
    </LandingLayout>
    </div>
  );
}