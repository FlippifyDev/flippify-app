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
          className="z-50 btn btn-ghost text-lightModeText text-2xl bg-transparent border-transparent drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125"
        >
          <IoMenu />
        </label>
      </div>
      <div className="drawer-side">
        <ul className="menu bg-white active:bg-white border-r-2 border-greyStroke text-base-content min-h-full w-80 p-4 flex flex-col justify-between">
          {/* Logo */}
          <div className="flex flex-col">
            <div className="flex justify-center mb-8 mt-4 select-none">
              <a className={`${lato.className} text-lightModeText text-4xl`}>flippify</a>
            </div>

            {/* Main Menu Section */}
            <section>
              <div>
                <a className="text-lightModeText text-lg font-bold select-none">Home</a>
              </div>
              <div>
                  <SideBarButton text="Dashboard" redirect="dashboard" symbol={<FaHouse className="text-lg" />} />
                  <SideBarButton text="Plans" redirect="plans" symbol={<FaSearch className="text-lg" />} />
                  <SideBarButton text="Server Plans" redirect="server-plans" symbol={<MdGroups className="text-2xl" />} />
                  <BillingPortalButton />
                  <Link
                    href="https://discord.gg/gNPYfe7YFm"
                    className="hover:bg-gray-100 active:bg-gray-300 text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md"
                  >
                    <span className="col-span-2 text-lg"><FaDiscord /></span>
                    <span className="col-span-10 text-base">Discord</span>
                  </Link>
              </div>
            </section>

            {/* Tools Section */}
            <section className="mt-12">
              <div>
                <a className="text-lightModeText text-lg font-bold select-none">Tools</a>
              </div>
              <UserSideBarButtons />
            </section>
          </div>

          {/* Settings and Other */}
          <section className="mt-10 flex flex-col">
              <SideBarButton text="Legal" redirect="legal" symbol={<BsClipboard2Fill className="text-lg" />} />
              <SignOutButton />
          </section>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
