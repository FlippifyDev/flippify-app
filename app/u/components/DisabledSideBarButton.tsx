'use client';

import React, { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (tooltip && buttonRef.current) {
      tippy(buttonRef.current, {
        content: tooltip,
      });
    }
  }, [tooltip]);

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
      ref={buttonRef}
      className="w-full hover:bg-gray-300 text-gray-600 grid grid-cols-12 items-center gap-2 px-4 py-2 rounded-md cursor-not-allowed"
      onClick={redirectUser}
      disabled
    >
      <span className={`col-span-2 text-lg ${isActive ? 'text-houseBlue' : ''}`}>{symbol}</span>
      <span className="col-span-10 text-base text-left">{text}</span>
    </button>
  );
};

export default DisabledSideBarButton;
