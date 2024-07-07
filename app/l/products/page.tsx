import ProductsList from "../components/ProductList";
import LandingLayout from '../components/LandingLayout'
import { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Products - Flippify',
  description: 'Explore Flippify’s product offerings, including Lego retirement deals and upcoming releases. Our platform monitors soon-to-retire Lego sets across multiple websites, ensuring you never miss a valuable deal. Stay tuned for more exciting products and exclusive offers.'
}


export default function Products() {
  return (
      <LandingLayout>
        <ProductsList />
      </LandingLayout>
  );
}
