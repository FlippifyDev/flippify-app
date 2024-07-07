// Local Imports
import Legal from '@/app/components/Legal';
import LandingLayout from '../components/LandingLayout'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Legal - Flippify',
  description: 'Access Flippify’s legal information including Privacy Policy and Terms and Conditions. Stay informed about our practices, your rights, and our commitment to protecting your data and ensuring a fair trading platform.'
}


export default function LegalPage() {
  return (
    <LandingLayout>
      <Legal />
    </LandingLayout>
  );
}