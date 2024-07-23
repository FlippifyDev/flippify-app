'use client';

import { signOut, useSession } from 'next-auth/react';
import { FaSignOutAlt } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const SidebarSignOutButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push(`/l/home`);
    }
  }, [session, router]); // Added session to the dependency array

  const handleSignOut = () => {
    signOut();
  };

  return (
    <button
      className="text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transform transition duration-200 hover:bg-red-600 hover:text-white"
      onClick={handleSignOut}
    >
      <span className="col-span-2 text-lg"><FaSignOutAlt /></span>
      <span className="col-span-10 text-base text-left">Sign Out</span>
    </button>
  );
};

export default SidebarSignOutButton;
    