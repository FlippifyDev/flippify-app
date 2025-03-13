'use client';

import { useSession } from 'next-auth/react';
import DisabledSideBarButton from './ButtonDisabled';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import SidebarButton from './Button';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { FaBook, FaBell } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";

interface SidebarHomeButtonsProps {
	isSidebarOpen: boolean;
	showAlert: () => void;
}

const SidebarHomeButtons: React.FC<SidebarHomeButtonsProps> = ({ isSidebarOpen, showAlert }) => {
	const { data: session } = useSession();
	const [unreadCount, setUnreadCount] = useState(0);

	return (
		<div className='w-full flex flex-col'>
			{/* Dashboard Button */}
			<SidebarButton text="Dashboard" redirect="dashboard" isSidebarOpen={isSidebarOpen} symbol={<FaHouse className="text-lg" />} />

			{/* Plans Button */}
			<SidebarButton text="Plans" redirect="plans" isSidebarOpen={isSidebarOpen} symbol={<FaSearch className="text-lg" />} />

			{/* Courses Button - for admin only */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton text="Courses" redirect='courses' isSidebarOpen={isSidebarOpen} symbol={<FaBook className="text-lg" />} />
			</LayoutSubscriptionWrapper>

			{/* Courses Button - for non-admin */}
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton text="Courses" redirect="courses" isSidebarOpen={isSidebarOpen} symbol={<FaBook className="text-lg" />} tooltip="Coming Soon" />
			</LayoutSubscriptionWrapper>

		</div>
	);
};

export default SidebarHomeButtons;
