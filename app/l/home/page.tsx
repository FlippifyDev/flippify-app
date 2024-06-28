import Navbar from '../components/Navbar';
import HomeDetails from '../components/HomeDetails';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
        <div className="min-h-screen bg-gradient-to-b from-houseBlue via-houseBlue-70% to-black">
        <div className="absolute inset-0 bg-texture-pattern opacity-30 mix-blend-overlay"></div>
          <div className="h-screen w-screen flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-10">
                <Navbar />
            </div>
            <div className="mt-16 flex-1 overflow-y-auto">
                <HomeDetails />
            </div>
        </div>
      </div>
    </Suspense>
  );
}

function Loading() {
  return <span className="loading loading-dots loading-lg"></span>;
}
