import { useState, useEffect, MouseEvent } from 'react';
import { Lato } from 'next/font/google';
import { IoMenu } from "react-icons/io5";
import Link from 'next/link';
import SignInWithDiscord from './SignInWithDiscord';

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

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (window.location.pathname !== '/l/home') {
      localStorage.setItem('scrollTo', id);
      window.location.href = `/l/home`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 50, // Adjust offset as needed
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className={`navbar grid grid-cols-12 grid-rows-1 items-center px-4 py-3 text-white transition duration-300 ${isScrolled ? 'bg-base-100 opacity-90 transition-colors duration-500' : 'bg-transparent'}`}>
      <div className="col-span-2">
        <a href="/l/home" className={`${lato.className} text-white text-4xl hover:text-gray-300 transition-colors duration-400`}>flippify</a>
      </div>

      <div className="drawer md:hidden flex justify-end col-span-10">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col lg:ml-64 right-0">
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
              <Link href="/l/pricing">Pricing</Link>
            </li>
            <li className="transition duration-100 active:scale-105 rounded-btn p-1">
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>About</a>
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

      <ul className="hidden md:flex flex-row space-x-8 col-span-8 justify-center">
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <Link href="/l/home">Home</Link>
        </li>
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <Link href="/l/products">Products</Link>
        </li>
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <Link href="/l/pricing">Pricing</Link>
        </li>
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>About</a>
        </li>
        <li className="transition duration-100 hover:scale-110 rounded-btn p-1">
          <a href="https://discord.gg/gNPYfe7YFm">Discord</a>
        </li>
      </ul>

      <div className="hidden md:flex items-center col-span-2 justify-end">
        <SignInWithDiscord />
      </div>
    </div>
  );
};

export default Navbar;
