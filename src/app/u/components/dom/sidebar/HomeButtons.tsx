'use client';

import { useSession } from 'next-auth/react';
import { ref, get } from 'firebase/database';
import { database } from '@/src/lib/firebase/client';
import DisabledSideBarButton from './ButtonDisabled';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import SidebarButton from './Button';

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
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

	useEffect(() => {
		if (!session?.user?.stripeCustomerId) return;

		const sanitizedCustomerId = session.user.stripeCustomerId.replace(/[.#$[\]]/g, '_');
		const notificationsRef = ref(database, 'notifications');

		const fetchNotifications = async () => {
			try {
				const snapshot = await get(notificationsRef);
				let unreadNotifications = 0;
				snapshot.forEach((childSnapshot) => {
					const notification = childSnapshot.val();
					if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
						unreadNotifications++;
					}
				});
				setUnreadCount(unreadNotifications);
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchNotifications();
	}, [session?.user?.stripeCustomerId]);

	return (
		<div className='w-full flex flex-col'>
			{/* Dashboard Button */}
			<SidebarButton text="Dashboard" redirect="dashboard" isSidebarOpen={isSidebarOpen} symbol={<FaHouse className="text-lg" />} />

			{/* Notifications Button with unread count */}
			<SidebarButton
				text="Notifications"
				redirect="notifications"
				isSidebarOpen={isSidebarOpen}
				symbol={
					<div className="relative">
						<FaBell className="text-lg" />
						{unreadCount > 0 && (
							<span className="absolute top-[-5px] right-[6px] lg:right-[8px] xl:right-[10px] text-xs text-white bg-houseBlue rounded-full h-4 w-4 flex items-center justify-center">
								{unreadCount}
							</span>
						)}
					</div>
				}
			/>

			{/* Reseller News Tab - for members/admin */}
			<LayoutSubscriptionWrapper anySubscriptions={["member", "admin"]}>
				<SidebarButton
					text="Reseller News"
					redirect="reseller-news"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaRegNewspaper className="text-lg" />}
				/>
			</LayoutSubscriptionWrapper>

			{/* Reseller News Tab - for non-members */}
			<LayoutSubscriptionWrapper anySubscriptions={["!member", "!admin"]}>
				<DisabledSideBarButton
					text="Reseller News"
					redirect="reseller-news"
					isSidebarOpen={isSidebarOpen}
					symbol={<FaRegNewspaper className="text-lg" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

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
