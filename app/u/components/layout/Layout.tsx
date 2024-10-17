"use client"

import React, { Suspense } from "react";
import LayoutSubscriptionWrapper from "./LayoutSubscriptionWrapper";
import LayoutLoadingSkeleton from "./LayoutLoadingSkeleton";
import LayoutNoAccess from "./LayoutNoAccess";
import Sidebar from "../dom/sidebar/Sidebar";
import Navbar from "../dom/navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
  requiredSubscriptions?: string[];
  anySubscriptions?: string[];
  pagePath?: string;
}

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-cover bg-gray-40 bg-center bg-fixed overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
        <div className="fixed top-0 left-0 h-screen z-40 overflow-y-auto">
          <Sidebar />
        </div>

        <div className="flex flex-col xl:ml-72 2xl:ml-80 w-full">
          <div className="fixed top-0 right-0 z-50"> 
            <Navbar />
          </div>

          {/* Wrap only the children content in Suspense */}
          <div className="scroll-smooth mt-16 pt-5 px-2 xl:mr-72 2xl:mr-80 flex justify-center z-0">
            <Suspense fallback={<LayoutLoadingSkeleton />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};


const Layout: React.FC<LayoutProps> = ({ children, requiredSubscriptions, anySubscriptions, pagePath }) => {
  // The following negates the required and any subscription so if the user has none of the subscriptions, then the LayoutNoAccess is displayed.
  let notRequiredSubscriptions: string[] = [];
  let notAnySubscriptions: string[] = [];

  if (requiredSubscriptions) {
    if (requiredSubscriptions[0] === "") {
      notRequiredSubscriptions = ["no access"]
    } else {
      requiredSubscriptions.forEach(sub => {
        notRequiredSubscriptions.push(`!${sub}`);
      });
    }
  }

  if (anySubscriptions) {
    if (anySubscriptions[0] === "") {
      notAnySubscriptions = ["no access"]
    } else {
      anySubscriptions.forEach(sub => {
        notAnySubscriptions.push(`!${sub}`);
      });
    }
  }


  return (
    <>
      {/* Check if the user does NOT have access, and display the LayoutNoAccess if true */}
      <LayoutSubscriptionWrapper requiredSubscriptions={notRequiredSubscriptions} anySubscriptions={notAnySubscriptions} pagePath={pagePath}>
        <LayoutContent>
          <LayoutNoAccess />
        </LayoutContent>
      </LayoutSubscriptionWrapper>

      {/* Render the actual content if the user has the required subscriptions */}
      <LayoutSubscriptionWrapper requiredSubscriptions={requiredSubscriptions} anySubscriptions={anySubscriptions}>
        <LayoutContent>{children}</LayoutContent>
      </LayoutSubscriptionWrapper>
    </>
  );
};

export default Layout;
