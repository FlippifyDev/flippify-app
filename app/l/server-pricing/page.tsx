import ServerPriceList from "../components/ServerPriceList";
import LandingLayout from '../components/LandingLayout';
import { Metadata } from 'next';
import Head from 'next/head';


export const metadata: Metadata = {
  title: 'Affordable Pricing Plans for Server Resellers - Flippify',
  description: 'Discover Flippify’s pricing plans designed to suit all your servers reselling needs. From monitoring soon-to-retire Lego sets to exclusive deals, our affordable plans help you maximize profits and stay ahead in the flipping game.'
}



export default function ServerPricing() {
  return (
    <div>
      <LandingLayout>
        <ServerPriceList />
      </LandingLayout>
    </div>
  );
}