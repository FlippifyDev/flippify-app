'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SideBarButtonProps {
  text: string;
  redirect: string;
}

const WaitlistJoinButton: React.FC<SideBarButtonProps> = ({ text, redirect }) => {
  const { data: session } = useSession();
  const router = useRouter();

  // Extract the base path without the username prefix
  const basePath = `/u/${session?.user?.name}`;

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
      className={"btn btn-primary bg-houseBlue text-white hover:bg-blue-600 w-3/4 md:w-2/3 mx-auto"}
      onClick={redirectUser}
    >
      <span>{text}</span>
    </button>
  );
};

export default WaitlistJoinButton;