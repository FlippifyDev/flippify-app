'use client';

import DisabledSideBarButton from './SidebarButtonDisabled';
import LayoutSubscriptionWrapper from '../layout/LayoutSubscriptionWrapper';
import SidebarButton from './SidebarButton';

import React from 'react';
import Link from 'next/link';
import { MdManageAccounts } from 'react-icons/md';
import { GiPointySword } from "react-icons/gi";
import { FaSearch, FaDiscord } from 'react-icons/fa';
import { BsClipboard2Fill } from 'react-icons/bs';
import { MdGroups } from 'react-icons/md';
import { FaHouse } from 'react-icons/fa6';
import { FaBook } from "react-icons/fa";
import { FaServer } from "react-icons/fa6";

interface SidebarHomeButtonsProps {
  showAlert: () => void;
}

const SidebarHomeButtons: React.FC<SidebarHomeButtonsProps> = ({ showAlert }) => {
  return (
    <div>

        <SidebarButton text="Dashboard" redirect="dashboard" symbol={<FaHouse className="text-lg" />} />

        {/* Manage Servers Tab */}
        <LayoutSubscriptionWrapper anySubscriptions={['standard', 'server', 'admin']}>
            <SidebarButton
                text="Server Management"
                redirect="manage-servers"
                symbol={<FaServer className="text-base" />}
            />
        </LayoutSubscriptionWrapper>
        <LayoutSubscriptionWrapper requiredSubscriptions={['!standard', '!server', '!admin']}>
            <DisabledSideBarButton
                text="Server Management"
                redirect="manage-servers"
                symbol={<FaServer className="text-base" />}
                showAlert={showAlert}
            />
        </LayoutSubscriptionWrapper>

        <SidebarButton text="Plans" redirect="plans" symbol={<FaSearch className="text-lg" />} />
        <SidebarButton text="Server Plans" redirect="server-plans" symbol={<MdGroups className="text-2xl" />} />

        <DisabledSideBarButton text="Courses" redirect='courses' symbol={<FaBook className="text-lg" />} tooltip="Coming Soon"/>
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
