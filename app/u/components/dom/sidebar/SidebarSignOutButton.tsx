'use client';

import { signOut, useSession } from 'next-auth/react';
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const SidebarSignOutButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // Handle redirect after session becomes null
  useEffect(() => {
    if (!session) {
      router.push(`/l/home`);
    }
  }, [session, router]);

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/l/home', // Redirect to landing page after sign out
    });
  };

  return (
    <button
      className="text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md w-full transition duration-200 hover:bg-red-600 hover:text-white"
      onClick={handleSignOut}
    >
      <span className="col-span-2 text-lg"><FaSignOutAlt /></span>
      <span className="col-span-10 text-base text-left">Sign Out</span>
    </button>
  );
};

export default SidebarSignOutButton;
