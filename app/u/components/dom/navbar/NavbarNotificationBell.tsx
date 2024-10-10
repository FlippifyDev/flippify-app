import React, { useEffect, useState } from 'react';
import { BsBell, BsBellSlash } from 'react-icons/bs';
import { database, ref, onValue, update } from '@/app/api/auth-firebase/firebaseConfig';

interface NavbarNotificationBellProps {
  notificationsEnabled: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: () => void;
  userData: { customerId: string }; // Assuming you pass customerId as a prop from the parent component
}

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, '_');  // Sanitize customerId for Firebase paths
};

const NavbarNotificationBell: React.FC<NavbarNotificationBellProps> = ({ 
  notificationsEnabled, 
  isDropdownOpen, 
  setIsDropdownOpen, 
  userData 
}) => {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userData?.customerId) return;  // Ensure customerId is available

    const sanitizedCustomerId = sanitizePath(userData.customerId);  // Sanitize customerId
    const notificationsRef = ref(database, 'notifications');
    
    // Listen for notifications from Firebase
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const notificationList: any[] = [];
      let unreadNotifications = 0;
      snapshot.forEach((childSnapshot) => {
        const notification = { id: childSnapshot.key, ...childSnapshot.val() };

        // Check if the current user has read the notification
        if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
          unreadNotifications++;
        }

        notificationList.push(notification);
      });
      setNotifications(notificationList);
      setUnreadCount(unreadNotifications);
      setHasNewNotifications(unreadNotifications > 0);
    });

    return () => unsubscribe();
  }, [userData?.customerId]);

  // Mark all notifications as read by the current user when the dropdown opens
  useEffect(() => {
    if (isDropdownOpen && userData?.customerId) {
      const sanitizedCustomerId = sanitizePath(userData.customerId);  // Sanitize customerId again
      notifications.forEach(async (notification) => {
        const notificationRef = ref(database, `notifications/${notification.id}`);
        
        if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
          // Add current user to the `readBy` list using their customerId
          await update(notificationRef, {
            [`readBy/${sanitizedCustomerId}`]: true  // Mark as read by this user
          });
        }
      });
      setHasNewNotifications(false);  // Reset the new notification indicator
      setUnreadCount(0);  // Reset unread count
    }
  }, [isDropdownOpen, notifications, userData?.customerId]);

  const handleBellClick = () => {
    if (notificationsEnabled) {
      setIsDropdownOpen();
    }
  };

  // Function to calculate time ago in minutes or hours
  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));  // Difference in minutes

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;  // Less than an hour
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours}h ago`;  // More than an hour
    }
  };

  return (
    <div className="relative pr-4">
      <div
        tabIndex={0}
        role="button"
        className="text-xl cursor-pointer relative"
        onClick={handleBellClick}
      >
        {notificationsEnabled ? (
          <>
            <BsBell className="text-lightModeText" />
            {unreadCount > 0 && (
              <span className="absolute top-[-4px] right-[-4px] flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-houseBlue rounded-full">
                {unreadCount}
              </span>
            )}
          </>
        ) : (
          <BsBellSlash className="text-lightModeText" />  // Bell slash when notifications are disabled
        )}
      </div>

      {/* Notifications Dropdown */}
      {isDropdownOpen && notificationsEnabled && (
        <ul className="absolute right-0 mt-3 bg-base-100 shadow-lg rounded-lg w-72 p-2 z-10">
          {notifications.length === 0 ? (
            <li className="text-sm text-gray-700">No new notifications</li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id} className="p-2 mb-2 bg-gray-200 border rounded-lg">
                <div className="text-sm font-bold text-black mb-1">{notification.title}</div>
                <div className="text-xs text-lightModeText">{notification.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {getTimeAgo(notification.timestamp)}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default NavbarNotificationBell;
