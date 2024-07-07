"use client";

import React from "react";
import Link from 'next/link';
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { Lato } from 'next/font/google';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Footer = () => {
  return (
    <div className=" w-full select-none bg-white flex justify-center">
      <footer className="footer flex flex-col md:flex-row items-center md:items-end justify-between p-4">
        <aside className="flex items-center">
          <a className={`${lato.className} text-black text-2xl font-bold`}>f</a>
          <p className="text-black ml-2">Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <aside className="flex justify-center w-full md:w-auto mb-1 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <Link href="legal" className="text-black hover:underline">Legal</Link>
        </aside>
        <nav className="flex items-center gap-4">
          <Link href='https://www.instagram.com/flippifyuk/'><button className="mx-2 text-black"><FaInstagram className="text-2xl" /></button></Link>
          <Link href='https://www.tiktok.com/@flippifyuk?lang=en'><button className="mx-2 text-black"><FaTiktok className="text-2xl" /></button></Link>
          <Link href='https://x.com/FlippifyUK'><button className="mx-2 text-black"><BsTwitterX className="text-2xl" /></button></Link>
          <Link href='https://discord.gg/gNPYfe7YFm'><button className="mx-2 text-black"><FaDiscord className="text-2xl" /></button></Link>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;

