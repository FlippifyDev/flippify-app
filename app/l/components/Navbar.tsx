'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignInWithDiscord from './SignInWithDiscord'

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route ? 'tab-active' : '';
  };


  return (
    <div>
      <div className="navbar bg-base-100 flex justify-between">
        <h1 className="text-3xl font-bold">Flippify</h1>

        <div className="tabs tabs-bordered">
          <Link href="/l/home" className={`tab ${isActive('/l/home')}`}>Home</Link>
          <Link href="/l/products" className={`tab ${isActive('/l/products')}`}>Products</Link>
          <Link href="/l/about" className={`tab ${isActive('/l/about')}`}>About</Link>
          <a href="https://discord.gg/gNPYfe7YFm" className="tab">Discord</a>
        </div>

        <div>
          <SignInWithDiscord />
        </div>
      </div>
      <hr className="my-1 h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
};

export default Navbar;
