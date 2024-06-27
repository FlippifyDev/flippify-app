'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignInWithDiscord from './SignInWithDiscord';
import { CSSProperties } from 'react';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route ? 'tab-active' : '';
  };

  const activeTabStyle: CSSProperties = {
    borderColor: '#A9A9A9',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    boxSizing: 'border-box',
    flex: 1,
    padding: '10px 20px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const commonTabStyle: CSSProperties = {
    flex: 1,
    padding: '10px 20px',
    textAlign: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div className="bg-lightGreyBackground">
      <div className="navbar flex justify-between items-center px-4 py-5 text-black border-b-2 border-greyStroke">
        <div className="flex items-center flex-1">
          <h1 className="text-3xl font-bold">Flippify</h1>
        </div>

        <ul role="tablist" className="tabs flex rounded-full overflow-hidden bg-white flex-row list-none p-0">
          <li className="flex-auto"><Link href="/l/home" className={`tab ${isActive('/l/home')}`} style={isActive('/l/home') ? activeTabStyle : commonTabStyle}>Home</Link></li>
          <li><Link href="/l/products" className={`tab ${isActive('/l/products')}`} style={isActive('/l/products') ? activeTabStyle : commonTabStyle}>Products</Link></li>
          <li><Link href="/l/about" className={`tab ${isActive('/l/about')}`} style={isActive('/l/about') ? activeTabStyle : commonTabStyle}>About</Link></li>
          <li><Link href="https://discord.gg/gNPYfe7YFm" className={`tab ${isActive('https://discord.gg/gNPYfe7YFm')}`} style={isActive('https://discord.gg/gNPYfe7YFm') ? activeTabStyle : commonTabStyle}>Discord</Link></li>
        </ul>


        <div className="flex items-center justify-end flex-1">
          <SignInWithDiscord />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
