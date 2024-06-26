'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignInWithDiscord from './SignInWithDiscord';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route ? 'tab-active' : '';
  };

  const activeTabStyle = {
    backgroundColor: '#A9A9A9',
    borderColor: '#A9A9A9',
    color: 'black',
  };

  return (
    <div>
      <div className="navbar border-b-2 border-greyStroke bg-lightGreyBackground h-30 flex justify-between items-center px-4 py-7 text-black">
        <div className="flex items-center flex-1">
          <h1 className="text-3xl font-bold">Flippify</h1>
        </div>

        <div role="tablist" className="tabs tabs-boxed border-b-2 border-greyStroke bg-white">
          <Link href="/l/home" className={`tab ${isActive('/l/home')}`} style={isActive('/l/home') ? activeTabStyle : {}}>Home</Link>
          <Link href="/l/products" className={`tab ${isActive('/l/products')}`} style={isActive('/l/products') ? activeTabStyle : {}}>Products</Link>
          <Link href="/l/about" className={`tab ${isActive('/l/about')}`} style={isActive('/l/about') ? activeTabStyle : {}}>About</Link>
          <Link href="https://discord.gg/gNPYfe7YFm" className={`tab ${isActive('https://discord.gg/gNPYfe7YFm')}`} style={isActive('https://discord.gg/gNPYfe7YFm') ? activeTabStyle : {}}>Discord</Link>
        </div>

        <div className="flex items-center justify-end flex-1">
          <SignInWithDiscord />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
