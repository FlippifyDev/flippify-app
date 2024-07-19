import PriceList from "../../components/PriceList";
import UserLayout from '../../components/UserLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flexible Pricing Plans for Resellers - Flippify',
  description: "Discover the best pricing plans tailored to your reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals on all other categories of products like electronics and sneakers, Flippify’s affordable plans help you boost your flipping profits."
};


export default function PlansPage() {
  return (
    <UserLayout>
      <PriceList />
    </UserLayout>
  );
}
