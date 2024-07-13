import Legal from '@/app/components/Legal';
import UserLegalLayout from '../../components/UserLegalLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flippify Legal Info - Privacy & Terms',
  description: "Access detailed legal information on Flippify, including our Privacy Policy and Terms and Conditions. Stay informed about our data practices, your rights, and our commitment to a fair trading platform."
};



export default function LegalPage() {
  return (
    <UserLegalLayout>
      <Legal />
    </UserLegalLayout>
  );
}