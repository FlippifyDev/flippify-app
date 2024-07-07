'use client';

import SignInWithDiscord from './SignInWithDiscord';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { Lato } from 'next/font/google';
import { IoMenu } from "react-icons/io5";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`navbar grid grid-cols-12 grid-rows-1 items-center px-4 py-3 text-white transition duration-300 ${isScrolled ? 'bg-base-100 opacity-90 transition-colors duration-500' : 'bg-transparent'}`}>
      {/* Logo or Brand */}
      <div className="col-span-2">
        <a href="/l/home" className={`${lato.className} text-white text-4xl hover:text-gray-300 transition-colors duration-400`}>flippify</a>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer md:hidden flex justify-end col-span-10">
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
      <ul className="hidden md:flex flex-row space-x-8 col-span-8 justify-center">
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
          <Link href="https://discord.gg/gNPYfe7YFm">Discord</Link>
        </li>
      </ul>

      {/* Right Side (Sign in with Discord or other actions) */}
      <div className="hidden md:flex items-center col-span-2 justify-end">
        <SignInWithDiscord />
      </div>
    </div>
  );
};

export default Navbar;
