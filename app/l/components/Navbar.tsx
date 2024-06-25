'use client'
import Link from 'next/link'

import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname()

  const isActive = (route: string) => {
    return pathname === route ? 'tab-active' : '';
  };

  return (
    <div>
      <div id="navigation-bar" className="navbar bg-base-100 flex justify-between">
        <h1 className="text-3xl font-bold">Flippify</h1>

        <div role="tablist" className="tabs tabs-bordered">
          <Link href="/l/home" className={`tab ${isActive('/l/home')}`}>Home</Link>
          <Link href="/l/products" className={`tab ${isActive('/l/products')}`}>Products</Link>
          <Link href="/l/about" className={`tab ${isActive('/l/about')}`}>About</Link>
          <Link href="https://discord.gg/gNPYfe7YFm" className="tab">Discord</Link>
        </div>
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
        <div className="avatar online">
          <div className="w-10 rounded-full">
            <img src="https://i.imgur.com/PyZ3xLX.png" />
          </div>
        </div>
          <li><Link href="/l/login">Login</Link></li>
          <li><Link href="/l/sign-up">Sign Up</Link></li>
        </ul>
      </div>
      <hr className="my-1 h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
}

export default Navbar;