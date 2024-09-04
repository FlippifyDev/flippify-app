'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PlansGetAccessButtonProps {
  redirect: string;
  specialPlan?: boolean;
}

const PlansGetAccessButton: React.FC<PlansGetAccessButtonProps> = ({ redirect, specialPlan }) => {
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


  const btnClass = specialPlan !== true ? 'btn border-0 bg-gray-200 hover:bg-gray-300 text-gray-500 w-2/3 mx-auto rounded-md': 'btn border-0 bg-white hover:bg-gray-200 text-black w-2/3 mx-auto rounded-sm'

  return (
    <div className="relative group w-full flex flex-col justify-end">
        <button
            className={btnClass}
            onClick={redirectUser}
        >
            Get Access
        </button>
    </div>
  );
};

export default PlansGetAccessButton;