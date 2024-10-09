import React, { useEffect, useState } from 'react';
import { BsBell, BsBellFill, BsBellSlash, BsBellSlashFill } from 'react-icons/bs';
import { database, ref, onValue, set } from '@/app/api/auth-firebase/firebaseConfig';

interface NavbarNotificationBellProps {
  notificationsEnabled: boolean;
  hasNewNotifications: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: () => void;
}

const NavbarNotificationBell: React.FC<NavbarNotificationBellProps> = ({ 
  notificationsEnabled, 
  hasNewNotifications, 
  isDropdownOpen, 
  setIsDropdownOpen 
}) => {

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
        <ul
          className="absolute right-0 mt-3 bg-base-100 shadow-lg rounded-lg w-52 p-2 z-10"
        >
          <li className="text-sm text-gray-700">
            {hasNewNotifications ? 'New Notification!' : 'No new notifications'}
          </li>
        </ul>
      )}
    </div>
  );
};

export default NavbarNotificationBell;
