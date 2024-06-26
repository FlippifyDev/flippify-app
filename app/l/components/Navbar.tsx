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
    <div className="navbar bg-base-100 flex justify-between items-center px-4 py-2">
      <div className="flex items-center flex-1">
        <h1 className="text-3xl font-bold">Flippify</h1>
      </div>

      <div role="tablist" className="tabs tabs-boxed">
        <Link href="/l/home" className={`tab ${isActive('/l/home')}`}>Home</Link>
        <Link href="/l/products" className={`tab ${isActive('/l/products')}`}>Products</Link>
        <Link href="/l/about" className={`tab ${isActive('/l/about')}`}>About</Link>
        <Link href="https://discord.gg/gNPYfe7YFm" className="tab">Discord</Link>
      </div>

        <div>
          <SignInWithDiscord />
        </div>

      </div>
    </div>
  );
};

export default Navbar;
