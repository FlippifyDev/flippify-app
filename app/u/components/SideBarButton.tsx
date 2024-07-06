'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface SideBarButtonProps {
  text: string;
  redirect: string;
  symbol: React.ReactNode;
}

const SideBarButton: React.FC<SideBarButtonProps> = ({ text, redirect, symbol }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Extract the base path without the username prefix
  const basePath = `/u/${session?.user?.name}`; // Adjust as per your session structure

  // Determine if the button should be active
  const isActive = pathname === `${basePath}/${redirect}`;

  const redirectUser = () => {
    if (session) {
      // Redirect to the username-specific URL or default redirect
      if (session.user?.name) {
        router.push(`${basePath}/${redirect}`);
      } else {
        router.push(`/u/loading`);
      }
    }
  };

  return (
    <button
      className={`text-greyText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200
        ${isActive ? 'bg-gray-600 text-gray-800 transform active:scale-90' : 'transform active:scale-90'}`
      }
      onClick={redirectUser}
    >
      <span className="col-span-2 text-lg">{symbol}</span>
      <span className="col-span-10 text-base">{text}</span>
    </button>
  );
};

export default SideBarButton;
