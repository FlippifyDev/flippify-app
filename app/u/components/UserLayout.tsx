import React, { Suspense } from 'react';
import Navbar from './Navbar';
import Loading from '../../components/Loading';
import Sidebar from './Sidebar';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const svg = `<svg id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="900" height="600" fill="#f1f1f1"></rect><defs><linearGradient id="grad1_0" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#ffffff" stop-opacity="1"></stop><stop offset="80%" stop-color="#ffffff" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_1" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#ffffff" stop-opacity="1"></stop><stop offset="80%" stop-color="#f8f8f8" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad1_2" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#f1f1f1" stop-opacity="1"></stop><stop offset="80%" stop-color="#f8f8f8" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_0" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#ffffff" stop-opacity="1"></stop><stop offset="80%" stop-color="#ffffff" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_1" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#f8f8f8" stop-opacity="1"></stop><stop offset="80%" stop-color="#ffffff" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_2" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#f8f8f8" stop-opacity="1"></stop><stop offset="80%" stop-color="#f1f1f1" stop-opacity="1"></stop></linearGradient></defs><g transform="translate(900, 0)"><path d="M0 459.7C-32.9 451.6 -65.8 443.4 -99.9 437.7C-134.1 432.1 -169.5 428.9 -199.5 414.2C-229.4 399.5 -253.9 373.3 -279.3 350.3C-304.8 327.2 -331.2 307.2 -354.2 282.4C-377.1 257.7 -396.5 228.1 -408.1 196.5C-419.8 165 -423.6 131.4 -430.9 98.4C-438.2 65.3 -449 32.6 -459.7 0L0 0Z" fill="#f4f4f4"></path><path d="M0 306.5C-21.9 301 -43.8 295.6 -66.6 291.8C-89.4 288 -113 285.9 -133 276.1C-152.9 266.3 -169.2 248.9 -186.2 233.5C-203.2 218.1 -220.8 204.8 -236.1 188.3C-251.4 171.8 -264.3 152.1 -272.1 131C-279.8 110 -282.4 87.6 -287.3 65.6C-292.1 43.5 -299.3 21.8 -306.5 0L0 0Z" fill="#fbfbfb"></path><path d="M0 153.2C-11 150.5 -21.9 147.8 -33.3 145.9C-44.7 144 -56.5 143 -66.5 138.1C-76.5 133.2 -84.6 124.4 -93.1 116.8C-101.6 109.1 -110.4 102.4 -118.1 94.1C-125.7 85.9 -132.2 76 -136 65.5C-139.9 55 -141.2 43.8 -143.6 32.8C-146.1 21.8 -149.7 10.9 -153.2 0L0 0Z" fill="#ffffff"></path></g><g transform="translate(0, 600)"><path d="M0 -459.7C34.3 -456.3 68.6 -453 101.2 -443.6C133.9 -434.2 164.9 -418.8 193.5 -401.8C222.2 -384.9 248.5 -366.5 278.1 -348.7C307.7 -330.9 340.6 -313.9 359.4 -286.6C378.2 -259.4 382.8 -222 393.7 -189.6C404.6 -157.2 421.8 -129.8 433.8 -99C445.9 -68.3 452.8 -34.1 459.7 0L0 0Z" fill="#f4f4f4"></path><path d="M0 -306.5C22.9 -304.2 45.7 -302 67.5 -295.7C89.3 -289.5 109.9 -279.2 129 -267.9C148.1 -256.6 165.6 -244.3 185.4 -232.5C205.1 -220.6 227.1 -209.2 239.6 -191.1C252.1 -172.9 255.2 -148 262.5 -126.4C269.7 -104.8 281.2 -86.5 289.2 -66C297.3 -45.5 301.9 -22.8 306.5 0L0 0Z" fill="#fbfbfb"></path><path d="M0 -153.2C11.4 -152.1 22.9 -151 33.7 -147.9C44.6 -144.7 55 -139.6 64.5 -133.9C74.1 -128.3 82.8 -122.2 92.7 -116.2C102.6 -110.3 113.5 -104.6 119.8 -95.5C126.1 -86.5 127.6 -74 131.2 -63.2C134.9 -52.4 140.6 -43.3 144.6 -33C148.6 -22.8 150.9 -11.4 153.2 0L0 0Z" fill="#ffffff"></path></g></svg>`;
  const base64SVG = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

  return (
    <Suspense fallback={<Loading />}>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed overflow-x-hidden"
        style={{ backgroundImage: `url('${base64SVG}')` }}
      >
        <div className="flex flex-col min-h-screen">

          <div className='fixed top-0 left-0 h-screen z-10'>
            <Sidebar />
          </div>


          <div className="flex flex-col xl:ml-80 w-full">
            <div className="fixed top-0 right-0 z-40">
              <Navbar />
            </div>

            <div className="scroll-smooth mt-16 p-4 xl:mr-80 flex justify-center">
              {children}
            </div>

          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default UserLayout;