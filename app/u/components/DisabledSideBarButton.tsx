'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface DisabledSideBarButtonProps {
  text: string;
  redirect: string;
  symbol: React.ReactNode;
  tooltip?: string; // Optional tooltip prop
}

const DisabledSideBarButton: React.FC<DisabledSideBarButtonProps> = ({ text, redirect, symbol, tooltip }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Extract the base path without the username prefix
  const basePath = `/u/${session?.user?.name}`;

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
      className={`relative w-full hover:bg-gray-300 text-gray-600 grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md cursor-not-allowed group transition duration-200 ${isActive ? 'bg-houseBlue text-white' : ''}`}
      onClick={redirectUser}
      disabled
    >
      {tooltip && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {tooltip}
        </div>
      )}
      <span className={`col-span-2 text-lg ${isActive ? 'text-white' : ''}`}>{symbol}</span>
      <span className="col-span-10 text-base text-left">{text}</span>
    </button>
  );
};

export default DisabledSideBarButton;
