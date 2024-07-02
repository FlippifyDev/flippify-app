"use client";

import React, { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt } from "react-icons/fa";

const SignOutButton = () => {
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
      className="text-greyText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transition-colors duration-600 ease-in-out hover:bg-gray-100 hover:text-gray-800 focus:outline-none" 
      onClick={handleSignOut}>
            <span className="col-span-2 text-lg"><FaSignOutAlt /></span>
            <span className="col-span-10 text-base">Sign Out</span>
      </button>
  );
};

export default SignOutButton;
