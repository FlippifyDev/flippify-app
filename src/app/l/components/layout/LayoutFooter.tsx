"use client";

import React from "react";
import Link from 'next/link';
import { BsTwitterX } from "react-icons/bs";
import { FaDiscord, FaTiktok, FaInstagram } from 'react-icons/fa6';
import { Lato } from 'next/font/google';
import { discordLink, instagramLink, tiktokLink, xLink } from "@/utils/constants";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const LayoutFooter = () => {
    return (
        <div className="w-full select-none bg-base-100 bg-opacity-90 flex justify-center">
            <footer className="footer flex flex-col md:flex-row items-center md:items-end justify-between p-4">
                <aside className="flex items-center">
                    <a href="#" className={`${lato.className} text-white text-2xl font-bold`}>f</a>
                    <p className="text-white ml-2">Copyright © {new Date().getFullYear()} - All right reserved</p>
                </aside>
                <aside className="flex justify-center w-full md:w-auto mb-1 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <Link href="legal" className="text-white hover:underline">Legal</Link>
                </aside>
                <nav className="flex items-center gap-4">
                    <Link href={instagramLink}><button className="mx-2 text-white"><FaInstagram className="text-xl" /></button></Link>
                    <Link href={tiktokLink}><button className="mx-2 text-white"><FaTiktok className="text-xl" /></button></Link>
                    <Link href={xLink}><button className="mx-2 text-white"><BsTwitterX className="text-lg" /></button></Link>
                    <Link href={discordLink}><button className="mx-2 text-white"><FaDiscord className="text-xl" /></button></Link>
                </nav>
            </footer>
        </div>
    );
};




export default LayoutFooter;
