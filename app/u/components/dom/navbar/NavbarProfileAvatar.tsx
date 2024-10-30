"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import createBillingPortalUrl from "@/app/api/stripe-handlers/create-billing-portal";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";


const NavbarProfileAvatar = () => {
  const { data: session } = useSession();
  const [billingUrl, setBillingUrl] = useState<string | null>(null);
  const discordUrl = "https://discord.gg/gNPYfe7YFm"
  const router = useRouter();
  const customerIdRef = useRef<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const root = process.env.ROOT as string;

  // Default avatar
  let avatar = "https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png";
  let referral_code = "None";

  if (session) {
    if (session.user?.image) {
      avatar = session.user.image;
    }
    if (session?.user.referral?.referral_code) {
      referral_code = session.user.referral.referral_code;
    }
  }

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      if (session?.user) {
        const user = session.user;
        customerIdRef.current = user.customerId || null;

        if (customerIdRef.current) {
          try {
            const url = await createBillingPortalUrl(
              user.name,
              customerIdRef.current
            );
            setBillingUrl(url);
          } catch (error) {
            console.error("Failed to create billing portal:", error);
            setBillingUrl(
              root.concat("/u/failed-to-create-billing-portal")
            );
          }
        }
      }
    };

    fetchCheckoutUrl();
  }, [session]);


  const handleBillingPortalButtonClick = () => {
    if (billingUrl) {
      window.open(billingUrl, "_blank");
    }
  };


  const handleDiscordButtonClick = () => {
    if (discordUrl) {
      window.open(discordUrl, "_blank");
    }
  };


  const handleProfileOpen = (e: React.MouseEvent) => {
    if (session) {
      if (session.user?.name) {
        router.push(`/u/${session.user.name}/profile`);
      } else {
        router.push(`/u/loading`);
      }
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggles the dropdown state
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      setIsDropdownOpen(false); // Closes dropdown when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAdminOpen = (e: React.MouseEvent) => {
    if (session) {
      if (session.user?.name) {
        router.push(`/u/${session.user.name}/asldf0987asDa230fDsADMIN`);
      } else {
        router.push(`/u/loading`);
      }
    }
  };

  const handleTestingOpen = (e: React.MouseEvent) => {
    if (session) {
      if (session.user?.name) {
        router.push(`/u/${session.user.name}/bfoau214QNI42nAjTEST`);
      } else {
        router.push(`/u/loading`);
      }
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
        onClick={toggleDropdown} // Toggle dropdown on avatar click
      >
        <div className="w-10 rounded-full">
          <Image
            alt="Avatar"
            src={avatar}
            width={50}
            height={50}
            loading="lazy"
          />
        </div>
      </div>
      {isDropdownOpen && ( // Conditionally render the dropdown menu
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        >
          <button 
            className='relative flex flex-col flex-wrap flex-shrink-0 align-items rounded-md hover:bg-gray-200 active:bg-gray-300 transform transition duration-200' 
            onClick={handleProfileOpen}>
            <span className='text-start px-[0.75rem] py-[0.25rem] text-[0.875rem]'>Profile</span>
          </button>
          <LayoutSubscriptionWrapper requiredSubscriptions={['admin']}>
            <button 
              className='relative flex flex-col flex-wrap flex-shrink-0 align-items rounded-md hover:bg-gray-200 active:bg-gray-300 transform transition duration-200' 
              onClick={handleAdminOpen}>
              <span className='text-start px-[0.75rem] py-[0.25rem] text-[0.875rem]'>Admin</span>
            </button>
          </LayoutSubscriptionWrapper>
          <LayoutSubscriptionWrapper requiredSubscriptions={['admin']}>
            <button 
              className='relative flex flex-col flex-wrap flex-shrink-0 align-items rounded-md hover:bg-gray-200 active:bg-gray-300 transform transition duration-200' 
              onClick={handleTestingOpen}>
              <span className='text-start px-[0.75rem] py-[0.25rem] text-[0.875rem]'>Testing Area</span>
            </button>
          </LayoutSubscriptionWrapper>
          <button 
            className='relative flex flex-col flex-wrap flex-shrink-0 align-items rounded-md hover:bg-gray-200 active:bg-gray-300 transform transition duration-200' 
            onClick={handleBillingPortalButtonClick}>
            <span className='text-start px-[0.75rem] py-[0.25rem] text-[0.875rem]'>Billing Portal</span>
          </button>
          <button
            onClick={handleDiscordButtonClick}
            className="relative flex flex-col flex-wrap flex-shrink-0 align-items rounded-md hover:bg-gray-200 active:bg-gray-300 transform transition duration-200"
          >
            <span className="text-start px-[0.75rem] py-[0.25rem] text-[0.875rem]">Discord</span>
          </button>
          <button 
            className='relative flex flex-col flex-wrap flex-shrink-0 align-items rounded-md hover:bg-red-600 hover:text-white active:bg-red-700 transform transition duration-200' 
            onClick={handleSignOut}>
            <span className='text-start px-[0.75rem] py-[0.25rem] text-[0.875rem]'>Sign Out</span>
          </button>
        </ul>
      )}
    </div>
  );
};

export default NavbarProfileAvatar;
