"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NotificationsList from "./NotificationsList";
import NotificationsControls from "./NotificationsControls";
import { fetchNotifications } from "@/src/services/firebase/notifications";

const NotificationsContent: React.FC = () => {
	const { data: session } = useSession();
	const [notifications, setNotifications] = useState<any[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);

	const customerId = session?.user.stripeCustomerId as string;

	useEffect(() => {
		const fetchNotificationsFunc = async () => {
			const response = await fetchNotifications(customerId)
			if (!response) {
				return;
			}
			setNotifications(response.notificationList);
			setUnreadCount(response.unreadNotifications);
		};

		fetchNotificationsFunc();
	}, [customerId]);
	const getTimeAgo = (timestamp: number) => {
		const now = Date.now();
		const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));

		if (diffInMinutes < 60) {
			return `${diffInMinutes}m ago`;
		} else {
			const diffInHours = Math.floor(diffInMinutes / 60);
			return `${diffInHours}h ago`;
		}
	};

	return (
		<div className="flex flex-col w-full h-screen">
			<div className="flex flex-col lg:flex-row px-2 lg:px-0 lg:space-x-4 space-y-4 lg:space-y-0 w-full h-full">

				{/* Notifications List Container */}
				<div className="w-full lg:w-1/2 p-4 bg-white border border-gray-300 rounded-lg shadow-md flex-grow">
					<NotificationsList
						notifications={notifications}
						customerId={customerId}
						setNotifications={setNotifications}
						setUnreadCount={setUnreadCount}
						getTimeAgo={getTimeAgo}
						handleNotificationClick={(url) => {
							if (url) {
								window.location.href = url;
							}
						}}
					/>
				</div>

				{/* Notifications Controls Container */}
				<div className="w-full lg:w-1/2 p-4 bg-white border border-gray-300 rounded-lg shadow-md flex-grow">
					<NotificationsControls />
				</div>
			</div>
		</div>
	);
};

export default NotificationsContent;
