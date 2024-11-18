"use client";

import React, { Suspense, useState } from "react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="relative flex h-screen overflow-x-hidden bg-userBackground">
      {/* Sidebar */}
      <section
        className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out bg-darkBackground ${
			isSidebarOpen ? 'w-72 2xl:w-80' : 'w-16'
        } z-50`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </section>

      {/* Content area */}
      <section
        className={`relative w-full flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'pl-72 2xl:pl-80' : 'pl-16'}`}
      >
        {/* Navbar */}
        <div className="relative w-full h-14 bg-white z-30">
          <Navbar />
        </div>

        {/* Scrollable main content */}
        <div className="relative flex-1 overflow-y-auto p-4 scrollbar-hide">
          <Suspense fallback={<LayoutLoadingSkeleton />}>
            {children}
          </Suspense>
        </div>
      </section>
    </main>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, requiredSubscriptions, anySubscriptions, pagePath }) => {
  // The following negates the required and any subscription so if the user has none of the subscriptions, then the LayoutNoAccess is displayed.
  let notRequiredSubscriptions: string[] = [];
  let notAnySubscriptions: string[] = [];

  if (requiredSubscriptions) {
    if (requiredSubscriptions[0] === "") {
      notRequiredSubscriptions = ["no access"];
    } else {
      requiredSubscriptions.forEach((sub) => {
        notRequiredSubscriptions.push(`!${sub}`);
      });
    }
  }

  if (anySubscriptions) {
    if (anySubscriptions[0] === "") {
      notAnySubscriptions = ["no access"];
    } else {
      anySubscriptions.forEach((sub) => {
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
