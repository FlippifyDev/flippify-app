import HomePage from './l/home/page'
import Loading from './components/Loading';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  );
}
