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
  return (
    <ul className="space-y-2">
      {notifications.length === 0 ? (
        <li className="text-gray-500">No new notifications</li>
      ) : (
        notifications.map((notification) => (
          <li
            key={notification.id}
            className="cursor-pointer p-2 bg-gray-100 hover:bg-gray-200 rounded"
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
