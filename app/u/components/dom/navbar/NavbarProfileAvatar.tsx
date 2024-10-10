import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import createBillingPortalUrl from '@/app/api/stripe-handlers/create-billing-portal';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import { BsBell, BsBellFill } from 'react-icons/bs'; // For notification bell

interface NavbarProfileAvatarProps {
  isDropdownOpen: boolean;
  unreadCount: number;
  onNotificationBellClick: () => void; // Handler for the bell click
  isSmallScreen: boolean; // Check if it's small screen
}

const NavbarProfileAvatar: React.FC<NavbarProfileAvatarProps> = ({
  isDropdownOpen,
  unreadCount,
  onNotificationBellClick,
  isSmallScreen
}) => {
  const { data: session } = useSession();
  const [billingUrl, setBillingUrl] = useState<string | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // Default avatar
  let avatar = 'https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png';

  if (session && session.user?.image) {
    avatar = session.user.image;
  }

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      if (session?.user?.customerId) {
        try {
          const url = await createBillingPortalUrl(session.user.name, session.user.customerId);
          setBillingUrl(url);
        } catch (error) {
          console.error('Failed to create billing portal:', error);
        }
      }
    };
    fetchCheckoutUrl();
  }, [session]);

  const handleProfileClick = () => {
    if (session?.user?.name) {
      router.push(`/u/${session.user.name}/profile`);
    }
  };

  const handleBillingPortalClick = () => {
    if (billingUrl) {
      window.open(billingUrl, '_blank');
    }
  };

  const handleSignOutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signOut();
  };

  const handleAdminClick = () => {
    if (session?.user?.name) {
      router.push(`/u/${session.user.name}/asldf0987asDa230fDsADMIN`);
    }
  };

  const handleTestingClick = () => {
    if (session?.user?.name) {
      router.push(`/u/${session.user.name}/bfoau214QNI42nAjTEST`);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      {/* Avatar with unread notification count */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar relative"
      >
        <div className="w-10 rounded-full">
          <Image alt="Avatar" src={avatar} width={40} height={40} />
        </div>
        {isSmallScreen && unreadCount > 0 && (
          <span className="absolute top-[-4px] right-[-4px] flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-houseBlue rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <ul ref={dropdownRef} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
          <button
            className="relative flex flex-col rounded-md hover:bg-gray-200 active:bg-gray-300 transition"
            onClick={handleProfileClick}
          >
            <span className="text-start px-3 py-1">Profile</span>
          </button>

          {/* Admin */}
          <LayoutSubscriptionWrapper requiredSubscriptions={['admin']}>
            <button
              className="relative flex flex-col rounded-md hover:bg-gray-200 active:bg-gray-300 transition"
              onClick={handleAdminClick}
            >
              <span className="text-start px-3 py-1">Admin</span>
            </button>
          </LayoutSubscriptionWrapper>

          {/* Testing Area */}
          <LayoutSubscriptionWrapper requiredSubscriptions={['admin']}>
            <button
              className="relative flex flex-col rounded-md hover:bg-gray-200 active:bg-gray-300 transition"
              onClick={handleTestingClick}
            >
              <span className="text-start px-3 py-1">Testing Area</span>
            </button>
          </LayoutSubscriptionWrapper>

          {/* Billing Portal */}
          <button
            className="relative flex flex-col rounded-md hover:bg-gray-200 active:bg-gray-300 transition"
            onClick={handleBillingPortalClick}
          >
            <span className="text-start px-3 py-1">Billing Portal</span>
          </button>

          {/* Sign Out */}
          <button
            className="relative flex flex-col rounded-md hover:bg-red-600 hover:text-white active:bg-red-700 transition"
            onClick={handleSignOutClick}
          >
            <span className="text-start px-3 py-1">Sign Out</span>
          </button>

          {/* Notifications (for small screen) */}
          {isSmallScreen && (
            <button
              className="relative flex items-center justify-between rounded-md hover:bg-gray-200 active:bg-gray-300 transition p-2"
              onClick={onNotificationBellClick} // Trigger notification dropdown
            >
              <BsBell className="text-lg" />
              {unreadCount > 0 && (
                <span className="ml-2 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-houseBlue rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          )}
        </ul>
      )}
    </div>
  );
};

export default NavbarProfileAvatar;
