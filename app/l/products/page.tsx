import ProductsList from "../components/ProductList";
import LandingLayout from '../components/LandingLayout';
import { Metadata } from 'next';
import Head from 'next/head';


export const metadata: Metadata = {
  title: 'Exclusive Flipping Products - Flippify Deals',
  description: 'Explore Flippify’s product offerings, including Advanced Lego retirement deals, Discounted Electronics, Sneakers and other upcoming releases. Our platform tracks soon-to-retire Lego sets across multiple websites along with many other categories like electronics and sneakers, ensuring you never miss a valuable deal. Stay updated for more exclusive products and offers.'
}


export default function Products() {
  return (
    <div>
      <Head>
        <meta name="google-site-verification" content="Hho6-HQ44X7tDo2PgIXmXtPOFHsg069qvKUSqF3JfkE" />
        <meta name="robots" content="index, follow" />
      </Head>
      <LandingLayout>
        <ProductsList />
      </LandingLayout>
      </div>
  );
}
