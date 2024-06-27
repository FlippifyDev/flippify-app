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
      <div className="navbar flex justify-between items-center px-4 py-3 text-black border-b-2 border-greyStroke">
        <div className="flex items-center flex-1">
          <h1 className="text-3xl font-bold transition duration-1 hover:blur-lg">Flippify</h1>
        </div>

        <div role="tablist" className="tabs flex justify-center border rounded-full overflow-hidden bg-white">
          <Link href="/l/home" className={`tab ${isActive('/l/home')} flex justify-center items-center`}>Home</Link>
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
