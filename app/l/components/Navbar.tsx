'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignInWithDiscord from './SignInWithDiscord';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route ? 'tab-active' : '';
  };

  return (
    <div className="bg-lightGreyBackground">
      <div className="navbar flex justify-between items-center px-4 py-5 text-black border-b-2 border-greyStroke">
        <div className="flex items-center flex-1">
          <h1 className="text-3xl font-bold">Flippify</h1>
        </div>

        <div role="tablist" className="tabs flex justify border rounded-full overflow-hidden bg-white">
          <Link href="/l/home" className={`tab ${isActive('/l/home')}`}>Home</Link>
          <Link href="/l/products" className={`tab ${isActive('/l/products')}`}>Products</Link>
          <Link href="/l/about" className={`tab ${isActive('/l/about')}`}>About</Link>
          <Link href="https://discord.gg/gNPYfe7YFm" className={`tab ${isActive('https://discord.gg/gNPYfe7YFm')}`}>Discord</Link>
        </div>

        <div className="flex items-center justify-end flex-1">
          <SignInWithDiscord />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
