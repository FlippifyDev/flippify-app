import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Loading from '../../components/Loading';
import Footer from '../components/Footer';
import GradientBackground from './GradientBackground';
import WhiteSection from './WhiteSection';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative overflow-hidden">
        {/* Gradient background component */}
        <GradientBackground />

        {/* White section component */}
        <WhiteSection />

        {/* Main content */}
        <div className="relative z-30">
          <div className="fixed top-0 left-0 right-0 z-50">
            <Navbar />
          </div>
          <div className="flex flex-col min-h-screen mt-16">
            {/* Content overlaying the entire structure */}
            {children}
          </div>
          <div className="mt-auto z-40">
            <Footer />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LandingLayout;
