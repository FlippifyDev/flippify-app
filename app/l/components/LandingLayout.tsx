import React, { Suspense } from "react";
import Navbar from "./Navbar";
import Loading from "../../components/Loading";
import GradientBackground from "./GradientBackground";
import WhiteSection from "./WhiteSection";
import Footer from "../components/Footer";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative min-h-screen bg-white flex flex-col">
        <div className="fixed w-full z-50">
          <Navbar />
        </div>

        <main className="relative flex-1 w-full overflow-hidden">
          <WhiteSection />
          <GradientBackground />
          <div className="relative flex justify-center z-10 mt-24 mb-24">{children}</div>
        </main>

        <footer className="relative h-full w-full flex justify-end">
          <Footer />
        </footer>
      </div>
    </Suspense>
  );
};

export default LandingLayout;
