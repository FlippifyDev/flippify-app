"use client";

import React from "react";
import NavbarProfile from "./NavbarProfile";
import { Lato } from 'next/font/google';
import { IoMenu } from 'react-icons/io5';
import Link from 'next/link';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Navbar = () => {
  return (
    <div className="navbar fixed w-full top-0 left-0 flex items-center justify-between shadow-planCardShadow bg-white px-4 py-2 z-10">
      <div className="flex items-center">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost text-lightModeText text-2xl bg-transparent border-transparent xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125"
        >
          <IoMenu />
        </label>
        <Link href="/" className={`text-lightModeText text-4xl ml-2 xl:ml-0 ${lato.className} hidden xl:inline`}>
          flippify
        </Link>
      </div>
      <Link href="/" className={`text-lightModeText text-4xl ${lato.className} xl:hidden`}>
        flippify
      </Link>
      <NavbarProfile />
    </div>
  );
};

export default Navbar;
