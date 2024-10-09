import React, { useEffect, useState } from 'react';
import { BsBell, BsBellFill, BsBellSlash, BsBellSlashFill } from 'react-icons/bs';
import { database, ref, onValue, update } from '@/app/api/auth-firebase/firebaseConfig';
import { useSession } from 'next-auth/react';  // Assuming next-auth is being used

interface NavbarNotificationBellProps {
  notificationsEnabled: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: () => void;
}

const NavbarNotificationBell: React.FC<NavbarNotificationBellProps> = ({ 
  notificationsEnabled, 
  isDropdownOpen, 
  setIsDropdownOpen 
}) => {
  const { data: session } = useSession();  // Retrieve the current session/user
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!session?.user) return;  // If no user, do nothing

    const notificationsRef = ref(database, 'notifications');
    
    // Listen for notifications from Firebase
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const notificationList: any[] = [];
      let unreadNotifications = false;
      snapshot.forEach((childSnapshot) => {
        const notification = { id: childSnapshot.key, ...childSnapshot.val() };

        // Check if the current user has read the notification
        if (!notification.readBy || !notification.readBy[session.user.id]) {
          unreadNotifications = true;
        }

        notificationList.push(notification);
      });
      setNotifications(notificationList);
      setHasNewNotifications(unreadNotifications);
    });

    return () => unsubscribe();
  }, [session?.user]);

  // Mark all notifications as read by the current user when the dropdown opens
  useEffect(() => {
    if (isDropdownOpen && session?.user) {
      notifications.forEach(async (notification) => {
        const notificationRef = ref(database, `notifications/${notification.id}`);
        
        if (!notification.readBy || !notification.readBy[session.user.id]) {
          // Add current user to the `readBy` list
          await update(notificationRef, {
            [`readBy/${session.user.id}`]: true  // Mark as read by this user
          });
        }
      });
      setHasNewNotifications(false);  // Reset the new notification indicator
    }
  }, [isDropdownOpen, notifications, session?.user]);

  const handleBellClick = () => {
    if (notificationsEnabled) {
      setIsDropdownOpen();
    }
  };

  return (
    <div className="relative pr-4">
      <div
        tabIndex={0}
        role="button"
        className="text-xl cursor-pointer"
        onClick={handleBellClick}
      >
        {notificationsEnabled ? (
          hasNewNotifications ? (
            <BsBellFill className="text-houseBlue animate-pulse" />
          ) : (
            <BsBell className="text-lightModeText" />
          )
        ) : (
          hasNewNotifications ? (
            <BsBellSlashFill className="text-houseBlue" />
          ) : (
            <BsBellSlash className="text-lightModeText" />
          )
        )}
      </div>

      {/* Notifications Dropdown */}
      {isDropdownOpen && (
        <ul className="absolute right-0 mt-3 bg-base-100 shadow-lg rounded-lg w-52 p-2 z-10">
          {notifications.length === 0 ? (
            <li className="text-sm text-gray-700">No new notifications</li>
          ) : (
            notifications.map((notification) => (
              <li key={notification.id} className="text-sm text-gray-700">
                {notification.title}: {notification.message}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default NavbarNotificationBell;
