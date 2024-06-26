import HomePage from './l/home/page'
import { Suspense } from 'react';

export default function Home() {
    return (
      <Suspense fallback={<Loading />}>
        <HomePage />
      </Suspense>
    );
}

function Loading() {
  return <span className="loading loading-dots loading-lg"></span>;
}

