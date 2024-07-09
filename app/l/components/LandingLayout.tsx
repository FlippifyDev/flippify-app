// LandingLayout.tsx
"use client";

import React from "react";
import Navbar from "./Navbar";
import GradientBackground from "./GradientBackground";
import WhiteSection from "./WhiteSection";
import Footer from "../components/Footer";

interface LandingLayoutProps {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      <main className="relative flex-1 w-full overflow-hidden">
        <WhiteSection
          topPadding={{
            base: 275, // Base padding value in pixels
            sm: 12, // Optional padding for small screens (>= 640px)
            md: 12, // Optional padding for medium screens (>= 768px)
            lg: 12, // Optional padding for large screens (>= 1024px)
            xl: 12, // Optional padding for extra-large screens (>= 1280px)
          }}
        />
        <GradientBackground />
        <div className="relative flex justify-center z-10 mt-24 mb-24">{children}</div>
      </main>

      <footer className="relative h-full w-full flex justify-end">
        <Footer />
      </footer>
    </div>
  );
};

export default LandingLayout;
