import React, { useState, useEffect } from "react";
import NavbarNotificationBell from "./NavbarNotificationBell";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { useSession } from 'next-auth/react';  // Using NextAuth

const NavbarProfile = () => {
  const { data: session } = useSession();  // Assuming session contains customerId (from Stripe)
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState<boolean>(false);

  // Ensure customerId is available from the session
  const userData = {
    customerId: session?.user?.customerId || "",  // Only using customerId, no uid
  };

  // Close both dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        !target.closest('.dropdown-profile') && 
        !target.closest('.dropdown-notification')
      ) {
        setIsProfileDropdownOpen(false);
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close notification dropdown if profile is opened and vice-versa
  const handleProfileClick = () => {
    setIsNotificationDropdownOpen(false);
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleNotificationClick = () => {
    setIsProfileDropdownOpen(false);
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  return (
    <div className="flex items-center bg-transparent p-1 group relative">
      {/* Notification Bell */}
      <div className="dropdown-notification">
        <NavbarNotificationBell
          notificationsEnabled={notificationsEnabled}
          isDropdownOpen={isNotificationDropdownOpen}
          setIsDropdownOpen={handleNotificationClick}
          userData={userData}  // Only passing customerId
        />
      </div>

      {/* Profile Avatar */}
      <div className="dropdown-profile" onClick={handleProfileClick}>
        <NavbarProfileAvatar isDropdownOpen={isProfileDropdownOpen} />
      </div>
    </div>
  );
};

export default NavbarProfile;
