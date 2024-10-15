'use client';

import DisabledSideBarButton from './SidebarButtonDisabled';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import SidebarButton from './SidebarButton';

import React from 'react';
import Link from 'next/link';
import { FaSearch, FaDiscord } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { FaHouse } from 'react-icons/fa6';
import { FaBook, FaBell } from "react-icons/fa";

interface SidebarHomeButtonsProps {
  showAlert: () => void;
}

const SidebarHomeButtons: React.FC<SidebarHomeButtonsProps> = ({ showAlert }) => {
  return (
    <div>

        <SidebarButton text="Dashboard" redirect="dashboard" symbol={<FaHouse className="text-lg" />} />
        <SidebarButton text="Notifications" redirect="notifications" symbol={<FaBell className="text-lg" />} />
        <SidebarButton text="Plans" redirect="plans" symbol={<FaSearch className="text-lg" />} />
        <SidebarButton text="Server Plans" redirect="server-plans" symbol={<MdGroups className="text-2xl" />} />
        <LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
          <SidebarButton text="Courses" redirect='courses' symbol={<FaBook className="text-lg" />} />
        </LayoutSubscriptionWrapper>
        <LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
          <DisabledSideBarButton text="Courses" redirect="courses" symbol={<FaBook className="text-lg" />} tooltip="Coming Soon"/>
        </LayoutSubscriptionWrapper>
        <Link
            href="https://discord.gg/gNPYfe7YFm"
            className="hover:bg-gray-100 active:bg-gray-300 text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transition duration-200"
            target="_blank"
        >
            <span className="col-span-2 text-lg"><FaDiscord /></span>
            <span className="col-span-10 text-base">Discord</span>
        </Link>
    </div>
  );
};

export default SidebarHomeButtons;
