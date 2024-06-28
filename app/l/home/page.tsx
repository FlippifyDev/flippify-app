import Navbar from '../components/Navbar';
import HomeDetails from '../components/HomeDetails';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
        <div>
          <Navbar />
          <HomeDetails />
        </div>
    </Suspense>
  );
}

function Loading() {
  return <span className="loading loading-dots loading-lg"></span>;
}
