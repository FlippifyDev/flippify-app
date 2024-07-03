'use client';


import SignInWithDiscord from './SignInWithDiscord';

import Link from 'next/link';
import { Lato } from 'next/font/google';
import { IoMenu } from "react-icons/io5";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin']});

const Navbar = () => {
  return (
    <div className="navbar flex justify-between items-center px-4 py-3 text-white">
      {/* Logo or Brand */}
      <div className="flex items-center">
        <a className="text-white text-4xl font-bold">flippify</a>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer md:hidden flex justify-end">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        {/* Right Side Menu (IoMenu for Small Screens) */}
        <div className="drawer-content flex flex-col lg:ml-64 right-0">
          {/* Toggle button for smaller screens */}
          <label
            htmlFor="my-drawer"
            className="btn btn-primary text-white text-2xl bg-transparent border-transparent drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125 z-50">
            <IoMenu />
          </label>
        </div>
        <div className="drawer-side opacity-95">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-full p-4">
            <li className="transition duration-100 active:scale-105 rounded-btn p-1">
              <Link href="/l/home">Home</Link>
            </li>
            <li className="transition duration-100 active:scale-105 rounded-btn p-1">
              <Link href="/l/products">Products</Link>
            </li>
            <li className="transition duration-100 active:scale-105 rounded-btn p-1">
              <Link href="/l/about">About</Link>
            </li>
            <li className="transition duration-100 active:scale-105 rounded-btn p-1">
              <a href="https://discord.gg/gNPYfe7YFm">Discord</a>
            </li>

            <div className="flex justify-center">
              <SignInWithDiscord />
            </div>

            </ul>
        </div>
      </div>

      {/* Navigation Links for Large Screens */}
      <ul className="hidden md:flex flex-row space-x-8">
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <Link href="/l/home">Home</Link>
        </li>
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <Link href="/l/products">Products</Link>
        </li>
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <Link href="/l/about">About</Link>
        </li>
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <a href="https://discord.gg/gNPYfe7YFm">Discord</a>
        </li>
      </ul>

      {/* Right Side (Sign in with Discord or other actions) */}
      <div className="hidden md:flex items-center">
        <SignInWithDiscord />
      </div>
    </div>
  );
};

export default Navbar;


/*
      <div className="navbar flex justify-between items-center px-4 py-3 text-white">
        <div className="flex items-center flex-1">
          <a className={`${lato.className} text-white text-4xl`}>flippify</a>
        </div>

        <ul role="tablist" className="tabs flex overflow-hidden flex-row p-2 space-x-12">
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="/l/home" >Home</Link></li>
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="/l/products">Products</Link></li>
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="/l/about">About</Link></li>
          <li className="flex-auto transition duration-100 hover:scale-110 rounded-btn p-1"><Link href="https://discord.gg/gNPYfe7YFm">Discord</Link></li>
        </ul>

        <div className="flex items-center justify-end flex-1">
          <SignInWithDiscord />
        </div>
      </div>
*/
