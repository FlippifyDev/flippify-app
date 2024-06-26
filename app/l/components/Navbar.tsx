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
    signIn('discord', {callbackUrl: '/u/user/'});
  };

  const handleSignOut = () => {
    signOut();
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

      <div className="flex items-center justify-end flex-1">
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box flex items-center">
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
                <div tabIndex={0} role="button" className="btn m-1 text-2xl"><BsJustify /></div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li><a>Settings</a></li>
                  <li><button onClick={handleSignOut}>Sign out</button></li>
                </ul>
              </div>
            </>
          ) : (
            <li><button onClick={handleSignIn}>Sign in with Discord</button></li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
