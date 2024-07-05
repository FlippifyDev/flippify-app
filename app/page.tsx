import HomePage from './l/home/page'
import Loading from './components/Loading';
import { Suspense, useEffect } from 'react';
import SmoothScroll from 'smooth-scroll';
import '../styles/global.css';

export default function Home() {
  useEffect(() => {
    const scroll = new SmoothScroll('a[href="#"]', {
      speed: 800,
      speedAsDuration: true,
    });

    return () => scroll.destroy();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  );
}
