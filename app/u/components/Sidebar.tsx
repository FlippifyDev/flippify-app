'use client';

import SidebarSignOutButton from './SidebarSignOutButton';
import SidebarBillingPortalButton from './SidebarBillingPortalButton';
import SidebarToolButtons from './SidebarToolButtons';
import SidebarButton from './SidebarButton';
import Alert from './Alert';

import React, { useState } from 'react';
import { Lato } from 'next/font/google';
import Link from 'next/link';

import { FaSearch, FaDiscord } from 'react-icons/fa';
import { BsClipboard2Fill } from 'react-icons/bs';
import { MdGroups } from 'react-icons/md';
import { FaHouse } from 'react-icons/fa6';
import { IoMenu } from 'react-icons/io5';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Sidebar = () => {
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  return (
    <div>
      <Alert message="Flippify Membership Required." visible={alertVisible} onClose={hideAlert} />
      <div className="drawer drawer-mobile xl:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <label
            htmlFor="my-drawer"
            className="z-50 btn btn-ghost text-lightModeText text-2xl bg-transparent border-transparent drawer-button xl:hidden hover:bg-transparent hover:border-transparent hover:scale-125"
          >
            <IoMenu />
          </label>
        </div>
        <div className="drawer-side">
          <ul className="menu bg-white active:bg-white border-r-2 border-greyStroke text-base-content min-h-full w-80 p-4 flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="flex justify-center mb-8 mt-4 select-none">
                <a className={`${lato.className} text-lightModeText text-4xl`}>flippify</a>
              </div>

              <section>
                <div>
                  <a className="text-lightModeText text-lg font-bold select-none">Home</a>
                </div>
                <div>
                  <SidebarButton text="Dashboard" redirect="dashboard" symbol={<FaHouse className="text-lg" />} />
                  <SidebarButton text="Plans" redirect="plans" symbol={<FaSearch className="text-lg" />} />
                  <SidebarButton text="Server Plans" redirect="server-plans" symbol={<MdGroups className="text-2xl" />} />
                  <SidebarBillingPortalButton />
                  <Link
                    href="https://discord.gg/gNPYfe7YFm"
                    className="hover:bg-gray-100 active:bg-gray-300 text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transition duration-200"
                  >
                    <span className="col-span-2 text-lg"><FaDiscord /></span>
                    <span className="col-span-10 text-base">Discord</span>
                  </Link>
                </div>
              </section>

              <section className="mt-6 md:mt-10">
                <div>
                  <a className="text-lightModeText text-lg font-bold select-none">Tools</a>
                </div>
                <SidebarToolButtons showAlert={showAlert} />
              </section>
            </div>

            <section className="mt-10 flex flex-col">
              <SidebarButton text="Legal" redirect="legal" symbol={<BsClipboard2Fill className="text-lg" />} />
              <SidebarSignOutButton />
            </section>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
