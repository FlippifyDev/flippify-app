import Navbar from '../components/Navbar';
import HomeDetails from '../components/HomeDetails';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-cover bg-center overflow-x-hidden"
           style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}>
        <div className="min-h-screen h-full w-full flex flex-col">
          <div className="fixed top-0 left-0 right-0 z-10">
            <Navbar />
          </div>
          <div className="mt-16 flex-1">
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
