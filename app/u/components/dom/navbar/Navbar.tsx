"use client";

import React from "react";
import NavbarProfile from "./NavbarProfile";
import { Lato } from 'next/font/google';
import Link from 'next/link';
import '@/styles/user-navbar.css';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Navbar = () => {
  return (
    <div className="navbar fixed w-full top-0 left-0 grid grid-cols-12 shadow-planCardShadow bg-white md:px-4 py-2 z-40">
      <div className="flex items-center xl:hidden col-span-2">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost text-lightModeText text-2xl bg-transparent border-transparent hover:bg-transparent hover:border-transparent hover:scale-125"
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        </label>
      </div>
      <div className="col-span-8 ml-2 mb-1 xl:col-span-4 flex justify-center xl:justify-start items-center">
        <Link href="/" className={`text-lightModeText text-4xl ${lato.className}`}>
          flippify
        </Link>
      </div>
      <div className="flex items-center justify-end col-span-2 xl:col-span-8">
        <NavbarProfile />
      </div>
    </div>
  );
};

export default Navbar;
