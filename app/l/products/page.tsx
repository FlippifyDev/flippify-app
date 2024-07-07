import ProductsList from "../components/ProductList";
import LandingLayout from '../components/LandingLayout'
import Loading from '../../components/Loading';

import { Suspense } from 'react';

export default function Products() {
  return (

      <LandingLayout>
        <ProductsList />
      </LandingLayout>

  );
}
