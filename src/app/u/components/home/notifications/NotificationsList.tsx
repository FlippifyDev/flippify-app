"use client";

import React, { useEffect } from "react";
import NotificationsDisplay from "./NotificationsDisplay";
import { markNotificationsAsRead } from "@/src/services/firebase/notifications"
import { INotification } from "@/src/models/firebase";

interface NotificationsListProps {
	notifications: INotification[];
	customerId: string;
	setUnreadCount: (value: number) => void;
	setNotifications: (notifications: INotification[]) => void;
	getTimeAgo: (timestamp: number) => string;
	handleNotificationClick: (url?: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
	notifications,
	customerId,
	setUnreadCount,
	setNotifications,
	getTimeAgo,
	handleNotificationClick,
}) => {
	useEffect(() => {
		const markAllAsRead = async () => {
		  // Mark notifications as read in Firebase
		  await markNotificationsAsRead(notifications, customerId);
	
		  // Ensure the state is correctly typed as INotification[]
		  const updatedNotifications: INotification[] = notifications.map((notification) => ({
			...notification,
			readBy: { ...notification.readBy, [customerId]: true }, // Mark as read locally
		  }));
	
		  // Update local state with the correctly typed array
		  setNotifications(updatedNotifications);
	
		  // Reset unread count to 0 after marking as read
		  setUnreadCount(0);
		};
	
		if (notifications.length > 0) {
		  markAllAsRead(); // Only mark as read if there are notifications
		}
	  }, [notifications, customerId, setNotifications, setUnreadCount]); // Dependencies updated to include notifications and customerId
	

	return (
		<div className="w-full h-full flex flex-col">
			{/* Header with dividers on both sides */}
			<div className="flex items-center justify-center mb-4 pb-2">
				<div className="flex-grow border-t border-gray-300"></div>
				<h2 className="text-xl font-bold px-4">Notifications</h2>
				<div className="flex-grow border-t border-gray-300"></div>
			</div>

			{/* Display notifications */}
			<div className="flex-grow overflow-y-auto pb-4">
				{notifications.length === 0 ? (
					<p className="flex justify-center">No notifications available.</p>
				) : (
					<NotificationsDisplay
						notifications={notifications}
						handleNotificationClick={handleNotificationClick}
						getTimeAgo={getTimeAgo}
					/>
				)}
			</div>
		</div>
	);
};

export default NotificationsList;
