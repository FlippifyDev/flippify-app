import React, { useState, useEffect } from 'react';
import NavbarNotificationBell from './NavbarNotificationBell';
import NavbarProfileAvatar from './NavbarProfileAvatar';
import { useSession } from 'next-auth/react';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';

const NavbarProfile = () => {
  const { data: session } = useSession();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const userData = {
    customerId: session?.user?.customerId || '',
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // Small screens <= 768px
    };

    handleResize(); // Trigger on mount
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle profile dropdown and close notification dropdown if open
  const handleProfileClick = () => {
    console.log("Profile clicked"); // Debug log
    setIsNotificationDropdownOpen(false); // Close notification dropdown if profile is clicked
    setIsProfileDropdownOpen((prevState) => !prevState); // Toggle profile dropdown
    console.log("isProfileDropdownOpen:", !isProfileDropdownOpen); // Track profile dropdown state
  };

  // Toggle notification dropdown and close profile dropdown if open
  const handleNotificationClick = () => {
    console.log("Notification bell clicked"); // Debug log
    setIsProfileDropdownOpen(false); // Close profile dropdown if notification bell is clicked
    setIsNotificationDropdownOpen((prevState) => !prevState); // Toggle notification dropdown
    console.log("isNotificationDropdownOpen:", !isNotificationDropdownOpen); // Track notification dropdown state
  };

  return (
    <div className="flex items-center bg-transparent p-1 group relative">
      <LayoutSubscriptionWrapper requiredSubscriptions={['member']}>
        {/* Notification bell on navbar for large screens */}
        {!isSmallScreen && (
          <div className="dropdown-notification">
            <NavbarNotificationBell
              notificationsEnabled={true}
              isDropdownOpen={isNotificationDropdownOpen}
              setIsDropdownOpen={handleNotificationClick}
              userData={userData}
              unreadCount={unreadCount}
            />
          </div>
        )}
      </LayoutSubscriptionWrapper>

        {/* Profile Avatar with notification bell in avatar dropdown on small screens */}
        <div className="dropdown-profile" onClick={handleProfileClick}>
          <NavbarProfileAvatar
            isDropdownOpen={isProfileDropdownOpen}
            unreadCount={unreadCount}
            onNotificationBellClick={handleNotificationClick} // Click handler for notification bell
            isSmallScreen={isSmallScreen}
            isNotificationDropdownOpen={isNotificationDropdownOpen} // Pass notification dropdown state
          />
        </div>
    </div>
  );
};

export default NavbarProfile;
