import { useState, useEffect, MouseEvent } from 'react';
import { Lato } from 'next/font/google';
import { IoMenu } from "react-icons/io5";
import { FaHouse } from "react-icons/fa6";
import Link from 'next/link';
import NavbarSignInWithDiscord from './NavbarSignInWithDiscord';
import NavbarSignInWithDiscordSideBar from './NavbarSignInWithDiscordSideBar'

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
      <div className="col-span-2 z-50">
        <a href="/l/home" className={`${lato.className} text-white text-4xl hover:text-gray-300 transition-colors duration-400`}>flippify</a>
      </div>

      <div className="drawer md:hidden flex justify-end col-span-10">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col lg:ml-64 right-0">
          <label
            htmlFor="my-drawer"
            className="btn btn-primary text-white text-2xl bg-transparent border-transparent shadow-none drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125 z-50">
            <IoMenu />
          </label>
        </div>
        {/* Side bar which appears on small screens */}
        <div className="drawer-side opacity-98 z-40">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-full pt-20">
            <li className="transition duration-100 active:bg-base-100 rounded-btn grid grid-cols-12 items-center gap-2 px-4 py-2 text-white text-lg font-medium">
              <span><FaHouse className="col-span-2 text-lg"/></span>
              <Link href="/l/home">Home</Link>
            </li>
            <li className="transition duration-100 active:bg-base-100 rounded-btn p-1 text-white text-lg font-medium">
              <Link href="/l/services">Services</Link>
            </li>
            <li className="transition duration-100 active:bg-base-100 rounded-btn p-1 text-white text-lg font-medium">
              <Link href="/l/plans">Plans</Link>
            </li>
            <li className="transition duration-100 active:bg-base-100 rounded-btn p-1 text-white text-lg font-medium">
              <Link href="/l/server-plans">Server Plans</Link>
            </li>
            <li className="transition duration-100 active:bg-base-100 rounded-btn p-1 text-white text-lg font-medium">
              <Link 
                href="https://discord.gg/gNPYfe7YFm" 
                target="_blank">
                  Discord
              </Link>
            </li>
            <li className="transition duration-100 active:bg-base-100 rounded-btn p-1 text-white text-lg font-medium">
              <NavbarSignInWithDiscordSideBar />
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main Navbar which appears on larger screens */} 
      <ul className="hidden md:flex flex-row space-x-3 xl:space-x-8 col-span-8 justify-center">
        <li className="transition duration-100 hover:scale-105 rounded-btn p-1">
          <Link href="/l/home">Home</Link>
        </li>
        <li className="transition duration-100 hover:scale-105 rounded-btn p-1">
          <Link href="/l/services">Services</Link>
        </li>
        <li className="transition duration-100 hover:scale-105 rounded-btn p-1">
          <Link href="/l/plans">Plans</Link>
        </li>
        <li className="transition duration-100 hover:scale-105 rounded-btn p-1">
          <Link href="/l/server-plans">Server Plans</Link>
        </li>
        <li className="transition duration-100 hover:scale-105 rounded-btn p-1">
          <Link href="https://discord.gg/gNPYfe7YFm" target="_blank">Discord</Link>
        </li>
      </ul>

      <div className="hidden md:flex items-center col-span-2 justify-end">
        <NavbarSignInWithDiscord />
      </div>
    </div>
  );
};

export default Navbar;
