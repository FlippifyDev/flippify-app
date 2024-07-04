"use client";

import React from "react";
import Link from 'next/link';
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord, FaInstagram, FaTiktok } from 'react-icons/fa6';
import { Lato } from 'next/font/google';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin']});

const Footer = () => {
  return (
    <div className="w-full select-none bg-white">
      <footer className="footer flex flex-col md:flex-row items-center justify-between p-2">
        <aside className="grid-flow-col items-center">
          <a className={`${lato.className} text-black text-2xl`}>f</a><p className="text-black">Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <div className="flex flex-row text-black">
              <Link href='https://www.instagram.com/flippifyuk/'><button className="mx-2"><FaInstagram className="text-2xl"/></button></Link>
              <Link href='https://www.tiktok.com/@flippifyuk?lang=en'><button className="mx-2"><FaTiktok className="text-2xl"/></button></Link>
              <Link href='https://x.com/FlippifyUK'><button className="mx-2"><BsTwitterX className="text-2xl"/></button></Link>
              <Link href='https://discord.gg/gNPYfe7YFm'><button className="mx-2"><FaDiscord className="text-2xl"/></button></Link>
            </div>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
