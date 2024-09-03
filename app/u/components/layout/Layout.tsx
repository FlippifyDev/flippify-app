import React, { Suspense } from "react";
import LayoutSubscriptionWrapper from "./LayoutSubscriptionWrapper";
import LayoutLoadingSkeleton from "./LayoutLoadingSkeleton";
import LayoutNoAccess from "./LayoutNoAccess";
import Sidebar from "../dom-sidebar/Sidebar";
import Navbar from "../dom-navbar/Navbar";

interface LayoutProps {
  children: React.ReactNode;
  requiredSubscriptions?: string[];
  anySubscriptions?: string[];
}

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-cover bg-gray-50 bg-center bg-fixed overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
        <div className="fixed top-0 left-0 h-screen z-10">
          <Sidebar />
        </div>

        <div className="flex flex-col xl:ml-80 w-full">
          <div className="fixed top-0 right-0 z-40">
            <Navbar />
          </div>

          {/* Wrap only the children content in Suspense */}
          <div className="scroll-smooth mt-16 pt-5 px-2 xl:mr-80 flex justify-center">
            <Suspense fallback={<LayoutLoadingSkeleton />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, requiredSubscriptions, anySubscriptions }) => {
  // The follow negates the required and any subscription so if the user has none of the subscriptions then the LayoutNoAccess is displayed.
  let notRequiredSubscriptions: string[] = [];
  let notAnySubscriptions: string[] = [];

  if (requiredSubscriptions !== undefined) {
    requiredSubscriptions.forEach(sub => {
      notRequiredSubscriptions.push(`!${sub}`)
    })
  }

  if (anySubscriptions !== undefined) {
    anySubscriptions.forEach(sub => {
      notAnySubscriptions.push(`!${sub}`)
    })
  }

  return (
    <>
      {/* User does not have required subscription and is not an admin. Block Access */}
      <LayoutSubscriptionWrapper requiredSubscriptions={notRequiredSubscriptions} anySubscriptions={notAnySubscriptions}>
        <LayoutContent>
          <LayoutNoAccess />
        </LayoutContent>
      </LayoutSubscriptionWrapper>

      {/* User has the required subscription and is not an admin. Allow Access */}
      <LayoutSubscriptionWrapper requiredSubscriptions={requiredSubscriptions} anySubscriptions={anySubscriptions}>
        <LayoutContent>{children}</LayoutContent>
      </LayoutSubscriptionWrapper>
    </>
  );
};

export default Layout;
