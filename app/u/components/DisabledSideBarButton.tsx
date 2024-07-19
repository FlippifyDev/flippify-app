'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface DisabledSideBarButtonProps {
  text: string;
  redirect: string;
  symbol: React.ReactNode;
}

const DisabledSideBarButton: React.FC<DisabledSideBarButtonProps> = ({ text, redirect, symbol }) => {
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
      className="btn btn-disabled w-full bg-white hover:bg-gray-100 text-lightModeText grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md active:bg-gray-300"
      onClick={redirectUser}
      >
      <span className={`col-span-2 text-lg ${isActive ? 'text-houseBlue' : ''}`}>{symbol}</span>
      <span className="col-span-10 text-base text-left">{text}</span>
    </button>
  );
};

export default DisabledSideBarButton;