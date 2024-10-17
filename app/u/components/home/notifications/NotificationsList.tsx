"use client";

import React, { useEffect } from "react";
import NotificationsDisplay from "./NotificationsDisplay";

interface NotificationsListProps {
  notifications: any[];
  markAllAsRead: () => void;
  getTimeAgo: (timestamp: number) => string;
  handleNotificationClick: (url?: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  markAllAsRead,
  getTimeAgo,
  handleNotificationClick,
}) => {
  // Automatically mark all notifications as read when the page loads
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

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
          <p>No notifications available.</p>
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
