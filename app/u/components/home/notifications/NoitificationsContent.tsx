"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; 
import { database, ref, onValue, update } from '@/app/api/auth-firebase/firebaseConfig'; // Modify as per your data fetching method
import NotificationsDisplay from './NotificationsDisplay'; // Assuming you have a reusable list component for notifications

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, '_'); // Sanitize customerId for Firebase paths
};

const NotificationsContent = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const userData = {
    customerId: session?.user?.customerId || '',
  };

  useEffect(() => {
    if (!userData.customerId) return;

    const sanitizedCustomerId = sanitizePath(userData.customerId);
    const notificationsRef = ref(database, 'notifications');

    // Fetch notifications and count unread ones
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

    setUnreadCount(0); // Reset unread count after marking all as read
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
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <button
        className="mb-4 bg-blue-500 text-white p-2 rounded"
        onClick={markAllAsRead}
      >
        Mark All as Read
      </button>

      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <NotificationsDisplay
          notifications={notifications}
          handleNotificationClick={(url) => {
            if (url) {
              window.location.href = url;
            }
          }}
          getTimeAgo={getTimeAgo}
        />
      )}
    </div>
  );
};

export default NotificationsContent;
