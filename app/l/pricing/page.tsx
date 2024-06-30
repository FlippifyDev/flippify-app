// Local Imports
import Navbar from "../components/Navbar";
import PricingContent from "../components/PricingContent";

import { Suspense } from "react";

export default function Pricing() {
  return (
    <Suspense fallback={<Loading />}>
      <div
        className="min-h-screen bg-cover bg-center overflow-x-hidden"
        style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}
      >
        <div className="flex flex-col min-h-screen">
          <div className="fixed top-0 left-0 right-0 z-10">
            <Navbar />
          </div>
          <div className="flex-1 mt-16 overflow-y-auto">
            <PricingContent />
          </div>
        </div>
      </div>
    </Suspense>
  );
}

function Loading() {
  return <span className="loading loading-dots loading-lg"></span>;
}
