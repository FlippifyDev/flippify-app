// Local Imports
import PriceList from "../components/PriceList";
import LandingLayout from '../components/LandingLayout'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Pricing - Flippify',
  description: 'Explore Flippify’s pricing plans and find the best deal to suit your needs. From monitoring soon-to-retire Lego sets to exclusive upcoming deals, discover how our affordable plans can help you maximize your flipping profits.'
}



export default function Pricing() {
  return (
      <LandingLayout>
        <PriceList />
      </LandingLayout>
  );
}