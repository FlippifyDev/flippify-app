'use client';

// Local Imports
import SignInWithDiscord from './SignInWithDiscord';

import Link from 'next/link';

const Navbar = () => {
  return (
      <div className="navbar flex justify-between items-center px-4 py-3 text-white">
        <div className="flex items-center flex-1">
          <h1 className="text-3xl font-bold">Flippify</h1>
        </div>

        <ul role="tablist" className="tabs flex overflow-hidden flex-row p-2 space-x-12">
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="/l/home" >Home</Link></li>
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="/l/products">Products</Link></li>
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="/l/pricing">Pricing</Link></li>
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="/l/about">About</Link></li>
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="https://discord.gg/gNPYfe7YFm">Discord</Link></li>
        </ul>

        <div className="flex items-center justify-end flex-1">
          <SignInWithDiscord />
        </div>
      </div>
  );
};

export default Navbar;
