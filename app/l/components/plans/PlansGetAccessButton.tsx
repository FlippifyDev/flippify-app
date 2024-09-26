"use client";

import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PlansGetAccessButtonProps {
  redirect: string;
  specialPlan?: boolean;
}

const PlansGetAccessButton: React.FC<PlansGetAccessButtonProps> = ({ redirect, specialPlan }) => {
  const { data: session } = useSession();
  const router = useRouter();

  // Handle redirect or sign-in
  const handleRedirect = () => {
    if (session) {
      if (session.user?.name) {
        router.push(`/u/${session.user.name}/dashboard`);
      } else {
        router.push(`/u/loading`);
      }
    } else {
      signIn('discord'); // Sign in via Discord if not logged in
    }
  };

  // Apply styles for the special plan
  const btnClass = specialPlan
    ? 'btn border-0 bg-houseBlue hover:bg-houseHoverBlue text-white w-2/3 mx-auto rounded-lg shadow-lg'
    : 'btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 w-2/3 mx-auto rounded-lg shadow-lg';

  return (
    <div className="relative group w-full flex flex-col justify-end">
      <button
        className={btnClass}
        onClick={handleRedirect}
      >
        Get Access Now
      </button>
    </div>
  );
};

export default PlansGetAccessButton;
