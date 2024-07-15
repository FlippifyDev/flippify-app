// Local Imports
import Legal from '@/app/components/Legal';
import LandingLayout from '../components/LandingLayout';
import { Metadata } from 'next';
import Head from 'next/head';


export const metadata: Metadata = {
  title: 'Flippify Legal Information - Privacy & Terms',
  description: 'Access Flippify’s comprehensive legal information, including our Privacy Policy and Terms and Conditions. Stay informed about our practices, your rights, and our dedication to protecting your data and ensuring fair trading.',
  robots: "index,follow"
}


export default function LegalPage() {
  return (
    <div>
    <LandingLayout>
      <Legal />
    </LandingLayout>
    </div>
  );
}