import React from 'react';

interface NavbarNotificationListProps {
	notifications: any[];
	handleNotificationClick: (redirectUrl?: string) => void;
	getTimeAgo: (timestamp: number) => string;
}

const NotificationsDisplay: React.FC<NavbarNotificationListProps> = ({
	notifications,
	handleNotificationClick,
	getTimeAgo,
}) => {
	const sortedNotifications = notifications.sort(
		(a, b) => b.timestamp - a.timestamp
	);

	return (
		<ul className="space-y-2 bg-gray-100 px-4 pt-4 flex-grow h-full min-h-full overflow-y-auto rounded-xl">
			{sortedNotifications.length === 0 ? (
				<li className="text-gray-500">No new notifications</li>
			) : (
				sortedNotifications.map((notification) => (
					<li
						key={notification.id}
						className="cursor-pointer p-4 border bg-white shadow-sm rounded-lg hover:bg-gray-50"
						onClick={() => handleNotificationClick(notification.redirectUrl)}
					>
						<div className="font-bold">{notification.title}</div>
						<div className="text-sm text-gray-600">{notification.message}</div>
						<div className="text-xs text-gray-400">{getTimeAgo(notification.timestamp)}</div>
					</li>
				))
			)}
		</ul>
	);
};

export default NotificationsDisplay;
