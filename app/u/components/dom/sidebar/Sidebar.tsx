"use client";

import SidebarMonitorButtons from './SidebarMonitorButtons';
import SidebarSignOutButton from './SidebarSignOutButton';
import SidebarHomeButtons from './SidebarHomeButtons';
import SidebarToolButtons from './SidebarToolButtons';
import SidebarButton from './SidebarButton';
import Alert from '@/app/components/Alert';

import React, { useState } from 'react';
import Link from 'next/link';
import { BsClipboard2Fill } from 'react-icons/bs';
import { MdFeedback } from "react-icons/md";

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
      <Alert message="Membership Required." visible={alertVisible} onClose={hideAlert} />
      <div className="drawer drawer-mobile xl:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side shadow-lg">
          <ul className="menu bg-white text-base-content min-h-full w-72 2xl:w-80 px-4 flex flex-col justify-between border-r border-gray-200">
            <div className="flex flex-col">
              {/* Home Section */}
              <section>
                <div className="mb-2">
                  <p className="text-lightModeText text-lg font-bold select-none">Home</p>
                </div>
                <SidebarHomeButtons showAlert={showAlert}/>
              </section>

              {/* Monitors Section */}
              <section className="mt-5 md:mt-6">
                <div className="mb-2">
                  <p className="text-lightModeText text-lg font-bold select-none">Monitors</p>
                </div>
                <SidebarMonitorButtons showAlert={showAlert} />
              </section>
              
              {/* Tools Section */}
              <section className="mt-5 md:mt-6">
                <div className="mb-2">
                  <p className="text-lightModeText text-lg font-bold select-none">Tools</p>
                </div>
                <SidebarToolButtons showAlert={showAlert} />
              </section>
            </div>

            <section className="mt-10 flex flex-col">
              <Link
                href="https://discord.com/channels/1236428617962229830/1236439119123447892"
                className="hover:bg-gray-100 active:bg-gray-300 text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transition duration-200"
                target="_blank"
              >
                <span className="col-span-2 text-lg"><MdFeedback /></span>
                <span className="col-span-10 text-base">Feedback</span>
              </Link>
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
