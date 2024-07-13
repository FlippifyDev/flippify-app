import ServerPriceList from "../../components/ServerPriceList";
import UserLayout from '../../components/UserLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User - Server Plans',
  description: "Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits."
};


export default function PlansPage() {
  return (
    <UserLayout>
      <ServerPriceList />
  </UserLayout>
  );
}
