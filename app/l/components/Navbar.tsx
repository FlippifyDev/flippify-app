'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignInWithDiscord from './SignInWithDiscord'

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route ? 'tab-active border-b-2 border-greyStroke bg-discordBlue text-white' : 'text-black';
  };


  return (
    <div>
      <div className="navbar border-b-2 border-greyStroke bg-lightGreyBackground h-30 flex justify-between items-center px-4 py-7 text-black">
        <div className="flex items-center flex-1">
          <h1 className="text-3xl font-bold">Flippify</h1>
        </div>

        <div role="tablist" className="tabs tabs-boxed border-b-2 border-greyStroke bg-white">
          <Link legacyBehavior href="/l/home">
            <a className={`tab ${isActive('/l/home')}`}>Home</a>
          </Link>
          <Link legacyBehavior href="/l/products">
            <a className={`tab ${isActive('/l/products')}`}>Products</a>
          </Link>
          <Link legacyBehavior href="/l/about">
            <a className={`tab ${isActive('/l/about')}`}>About</a>
          </Link>
          <a href="https://discord.gg/gNPYfe7YFm" className={`tab ${isActive('https://discord.gg/gNPYfe7YFm')}`}>Discord</a>
        </div>

        <div className="flex items-center justify-end flex-1">
          <SignInWithDiscord />
        </div>
      </div>
    </div>
  );
};

export default Navbar;


