// Local Imports
import PriceList from "../components/PriceList";
import LandingLayout from '../components/LandingLayout'
import Loading from '../../components/Loading';

import { Suspense } from 'react';


export default function Pricing() {
  return (

      <LandingLayout>
        <PriceList />
      </LandingLayout>

  );
}