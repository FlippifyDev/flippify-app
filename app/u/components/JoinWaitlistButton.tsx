'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface SideBarButtonProps {
  text: string;
  redirect: string;
}

const JoinWaitlistButton: React.FC<SideBarButtonProps> = ({ text, redirect }) => {
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
      className={"btn btn-primary bg-houseBlue text-white hover:bg-blue-600"}
      onClick={redirectUser}
    >
      <span>{text}</span>
    </button>
  );
};

export default JoinWaitlistButton;
