import React from 'react';
import { BsBell, BsBellFill, BsBellSlash, BsBellSlashFill } from 'react-icons/bs';

interface NavbarNotificationBellProps {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
}

const NavbarNotificationBell: React.FC<NavbarNotificationBellProps> = ({ notificationsEnabled, toggleNotifications }) => {
  return (
    <div className="pr-4 text-xl">
      {notificationsEnabled ? (
        <BsBellFill className="text-houseBlue animate-pulse" onClick={toggleNotifications} />
      ) : (
        <BsBell className="text-lightModeText" onClick={toggleNotifications} />
      )}
    </div>
  );
};

export default NavbarNotificationBell;
