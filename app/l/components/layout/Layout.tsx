"use client";

import React from "react";
import Navbar from "../dom/Navbar";
import LayoutGradientBackground from "./LayoutGradientBackground";
import LayoutWhiteSection from "./LayoutWhiteSection";
import LayoutFooter from "./LayoutFooter";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-white flex flex-col">
      <div className="fixed w-full z-50">
        <Navbar />
      </div>

      <main className="relative flex-1 w-full overflow-hidden">
        <LayoutWhiteSection />
        <LayoutGradientBackground />
        <div className="relative flex justify-center z-10 mt-24 mb-24">
          {children}
        </div>
      </main>

      <footer className="relative h-full w-full flex justify-end">
        <LayoutFooter />
      </footer>
    </div>
  );
};

export default Layout;
