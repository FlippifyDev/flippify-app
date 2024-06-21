'use client'

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
          <a href="/l/home" className={`tab ${isActive('/l/home')}`}>Home</a>
          <a href="/l/products" className={`tab ${isActive('/l/products')}`}>Products</a>
          <a href="/l/about" className={`tab ${isActive('/l/about')}`}>About</a>
          <a href="https://discord.com" className="tab">Discord</a>
        </div>

        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
          <li><a href="/l/login">Login</a></li>
          <li><a href="/l/sign-up">Sign Up</a></li>
        </ul>
      </div>
      <hr className="my-1 h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
}

export default Navbar;