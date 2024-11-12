'use client';

import { useSession } from 'next-auth/react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/src/lib/firebase/client';
import DisabledSideBarButton from './SidebarButtonDisabled';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import SidebarButton from './SidebarButton';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaDiscord } from 'react-icons/fa';
import { MdGroups } from 'react-icons/md';
import { FaHouse } from 'react-icons/fa6';
import { FaBook, FaBell } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";

interface SidebarHomeButtonsProps {
	showAlert: () => void;
}

const SidebarHomeButtons: React.FC<SidebarHomeButtonsProps> = ({ showAlert }) => {
	const { data: session } = useSession();
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		if (!session?.user?.customerId) return;

		const sanitizedCustomerId = session.user.customerId.replace(/[.#$[\]]/g, '_');
		const notificationsRef = ref(database, 'notifications');

		const unsubscribe = onValue(notificationsRef, (snapshot) => {
			let unreadNotifications = 0;
			snapshot.forEach((childSnapshot) => {
				const notification = childSnapshot.val();
				if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
					unreadNotifications++;
				}
			});
			setUnreadCount(unreadNotifications);
		});

		return () => unsubscribe();
	}, [session?.user?.customerId]);

	return (
		<div>

			<SidebarButton text="Dashboard" redirect="dashboard" symbol={<FaHouse className="text-lg" />} />

			{/* Notifications with unread count */}
			<SidebarButton
				text="Notifications"
				redirect="notifications"
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

			{/* Reseller News Tab */}
			<LayoutSubscriptionWrapper anySubscriptions={["member", "admin"]}>
				<SidebarButton
					text="Reseller News"
					redirect="reseller-news"
					symbol={<FaRegNewspaper className="text-md" />}
				/>
			</LayoutSubscriptionWrapper>

			<LayoutSubscriptionWrapper anySubscriptions={["!member", "!admin"]}>
				<DisabledSideBarButton
					text="Reseller News"
					redirect="reseller-news"
					symbol={<FaRegNewspaper className="text-md" />}
					tooltip="Coming Soon"
				/>
			</LayoutSubscriptionWrapper>

			<SidebarButton text="Plans" redirect="plans" symbol={<FaSearch className="text-lg" />} />
			<SidebarButton text="Server Plans" redirect="server-plans" symbol={<MdGroups className="text-2xl" />} />
			<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
				<SidebarButton text="Courses" redirect='courses' symbol={<FaBook className="text-lg" />} />
			</LayoutSubscriptionWrapper>
			<LayoutSubscriptionWrapper requiredSubscriptions={["!admin"]}>
				<DisabledSideBarButton text="Courses" redirect="courses" symbol={<FaBook className="text-lg" />} tooltip="Coming Soon" />
			</LayoutSubscriptionWrapper>

		</div>
	);
};

export default SidebarHomeButtons;
