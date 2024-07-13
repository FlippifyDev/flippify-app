'use client';

import SideBarButton from './SideBarButton';
import SignOutButton from './SignOutButton';
import BillingPortalButton from './BillingPortalButton';
import UserSideBarButtons from './UserSidebarButtons'

import { Lato } from 'next/font/google';
import Link from 'next/link';

import { IoMenu } from 'react-icons/io5';
import { FaHouse } from 'react-icons/fa6';
import { FaSearch, FaDiscord } from 'react-icons/fa';
import { BsClipboard2Fill } from 'react-icons/bs';
import { MdGroups } from "react-icons/md";

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Sidebar = () => {
  return (
    <div className="drawer drawer-mobile xl:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Toggle button for smaller screens */}
        <label
          htmlFor="my-drawer"
          className="z-50 btn btn-primary text-white text-2xl bg-transparent border-transparent drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125"
        >
          <IoMenu />
        </label>
      </div>
      <div className="drawer-side">
        <ul className="menu bg-base-100 opacity-90 border-r-2 text-base-content min-h-full w-80 p-4 flex flex-col justify-between">
          {/* Logo */}
          <div className="flex flex-col">
            <div className="flex justify-center mb-8 mt-4 select-none">
              <a className={`${lato.className} text-white text-4xl`}>flippify</a>
            </div>

            {/* Main Menu Section */}
            <div>
              <a className="text-white text-lg font-bold select-none">Home</a>
            </div>
            <ul>
              <li>
                <SideBarButton text="Dashboard" redirect="dashboard" symbol={<FaHouse className="text-lg" />} />
              </li>
              <li>
                <SideBarButton text="Plans" redirect="plans" symbol={<FaSearch className="text-lg" />} />
              </li>
              <li>
                <SideBarButton text="Server Plans" redirect="server-plans" symbol={<MdGroups className="text-2xl" />} />
              </li>
              <li>
                <BillingPortalButton />
              </li>
            <li>
              <Link
                href="https://discord.gg/gNPYfe7YFm"
                className="text-greyText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transform active:scale-90 transition duration-200"
              >
                <span className="col-span-2 text-lg"><FaDiscord /></span>
                <span className="col-span-10 text-base">Discord</span>
              </Link>
              </li>
            </ul>
          </div>

          
          {/* Display Users' Bots */}
          <div className='mt-4'>
            <a className="text-white text-lg font-bold select-none">My Account</a>
          </div>
          <UserSideBarButtons />

          {/* Settings and Other */}
          <div className="mt-auto flex flex-col">
            <li className="mt-auto">
              <SideBarButton text="Legal" redirect="legal" symbol={<BsClipboard2Fill className="text-lg" />} />
            </li>
            <li className="mt-auto">
              <SignOutButton />
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
