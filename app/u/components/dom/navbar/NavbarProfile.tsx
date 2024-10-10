import React, { useState, useEffect } from 'react';
import NavbarNotificationBell from './NavbarNotificationBell';
import NavbarProfileAvatar from './NavbarProfileAvatar';
import { useSession } from 'next-auth/react'; // Using NextAuth
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';

const NavbarProfile = () => {
  const { data: session } = useSession(); // Assuming session contains customerId (from Stripe)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Ensure customerId is available from the session
  const userData = {
    customerId: session?.user?.customerId || '', // Only using customerId, no uid
  };

  // Detect screen size to determine whether it's a small screen
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Small screens: 768px or less
    };

    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize); // Listen for resize

    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup on unmount
    };
  }, []);

  // Close both dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('.dropdown-profile') && !target.closest('.dropdown-notification')) {
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
      <LayoutSubscriptionWrapper requiredSubscriptions={['member']}>
        {!isSmallScreen && (
          <div className="dropdown-notification">
            <NavbarNotificationBell
              notificationsEnabled={notificationsEnabled}
              isDropdownOpen={isNotificationDropdownOpen}
              setIsDropdownOpen={handleNotificationClick}
              userData={userData}
              unreadCount={unreadCount} // Pass unread count to the bell
            />
          </div>
        )}
      </LayoutSubscriptionWrapper>

      {/* Profile Avatar */}
      <div className="dropdown-profile" onClick={handleProfileClick}>
        <NavbarProfileAvatar
          isDropdownOpen={isProfileDropdownOpen}
          unreadCount={unreadCount} // Pass unread count to avatar
          onNotificationBellClick={handleNotificationClick}
          isSmallScreen={isSmallScreen} // Pass small screen state
        />
      </div>
    </div>
  );
};

export default NavbarProfile;
