import Legal from '@/app/components/Legal';
import UserLegalLayout from '../../components/UserLegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User - Legal',
  description: "Access Flippify’s legal information including Privacy Policy and Terms and Conditions. Stay informed about our practices, your rights, and our commitment to protecting your data and ensuring a fair trading platform."
};



export default function LegalPage() {
  return (
    <UserLegalLayout>
      <Legal />
    </UserLegalLayout>
  );
}