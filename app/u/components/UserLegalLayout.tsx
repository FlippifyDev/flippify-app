import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Loading from '../../components/Loading';
import Sidebar from './Sidebar';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading />}>
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-lightGreyBackground overflow-hidden"
    >
      <div className="flex flex-col min-h-screen">
        {/* Sidebar */}
        <div className='fixed top-0 left-0 h-screen z-10'>
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex flex-col xl:ml-80 w-full">
          {/* Navbar */}
          <div className="fixed top-0 right-0">
            <Navbar />
          </div>

          {/* Page content */}
          <div className="scroll-smooth mt-16 xl:mr-80 flex justify-start">
            {children}
          </div>

        </div>
      </div>
    </div>
  </Suspense>
  );
};

export default UserLayout;