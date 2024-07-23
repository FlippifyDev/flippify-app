import ServerPlansPage from "../../components/ServerPlansPage";
import UserLayout from '../../components/Layout';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User - Server Plans',
  description: "Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits."
};


export default function ServerPlans() {
  return (
    <UserLayout>
      <ServerPlansPage />
    </UserLayout>
  );
}
