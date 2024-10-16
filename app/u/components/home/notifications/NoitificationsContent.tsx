"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { database, ref, onValue, update } from "@/app/api/auth-firebase/firebaseConfig";
import NotificationsList from "./NotificationsList";
import NotificationsControls from "./NotificationsControls";

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, "_"); // Sanitize customerId for Firebase paths
};

const NotificationsContent: React.FC = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const userData = {
    customerId: session?.user?.customerId || "",
  };

  useEffect(() => {
    if (!userData.customerId) return;

    const sanitizedCustomerId = sanitizePath(userData.customerId);
    const notificationsRef = ref(database, "notifications");

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const notificationList: any[] = [];
      let unreadNotifications = 0;

      snapshot.forEach((childSnapshot) => {
        const notification = { id: childSnapshot.key, ...childSnapshot.val() };

        if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
          unreadNotifications++;
        }

        notificationList.push(notification);
      });

      setNotifications(notificationList);
      setUnreadCount(unreadNotifications);
    });

    return () => unsubscribe();
  }, [userData.customerId]);

  const markAllAsRead = () => {
    const sanitizedCustomerId = sanitizePath(userData.customerId);

    notifications.forEach(async (notification) => {
      const notificationRef = ref(database, `notifications/${notification.id}`);

      if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
        await update(notificationRef, {
          [`readBy/${sanitizedCustomerId}`]: true,
        });
      }
    });

    setUnreadCount(0);
  };

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
      <div className="flex flex-col lg:flex-row px-2 lg:px-0 lg:space-x-2 space-y-4 lg:space-y-0 w-full h-full">
        
        {/* Notifications List Container */}
        <div className="w-full lg:w-1/2 p-4 bg-white border border-gray-300 rounded-lg shadow-md flex-grow">
          <NotificationsList
            notifications={notifications}
            markAllAsRead={markAllAsRead}
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
