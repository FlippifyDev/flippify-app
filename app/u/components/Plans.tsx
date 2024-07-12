import React, { Suspense } from "react";
import Navbar from "../components/Navbar";
import PriceList from "./PriceList";
import Loading from "../../components/Loading";

export default function Plans() {
  return (
    <Suspense fallback={<Loading />}>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
        style={{ backgroundImage: "url('https://i.imgur.com/2dItFcN.png')" }}
      >
        <div className="flex flex-col min-h-screen">
          <div className="fixed top-0 left-0 right-0 z-10">
            <Navbar />
          </div>
          <div className="overflow-y-auto">
            <PriceList />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
