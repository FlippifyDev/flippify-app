'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BsJustify } from 'react-icons/bs';

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (route: string) => {
    return pathname === route ? 'tab-active' : '';
  };

  const handleSignIn = () => {
    signIn('discord');
  };

  const handleSignOut = () => {
    signOut();
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

        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
          {session ? (
            <>
              <div className="avatar online">
                <div className="w-9 rounded-full">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="User Avatar" />
                  ) : (
                    <img src="https://i.imgur.com/PyZ3xLX.png" alt="Default Avatar" />
                  )}
                </div>
              </div>
              <li><span>{session.user?.name ?? 'User'}</span></li>
              <div className="dropdown dropdown-hover">
                <div tabIndex={0} role="button" className="btn m-1"><BsJustify /></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><a>Settings</a></li>
                  <li><button onClick={handleSignOut}>Sign out</button></li>
                </ul>
              </div>
              <li><span>Access Token: {session.accessToken}</span></li>
            </>
          ) : (
            <li><button onClick={handleSignIn}>Sign in with Discord</button></li>
          )}
        </ul>
      </div>
      <hr className="my-1 h-px bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  );
};

export default Navbar;
