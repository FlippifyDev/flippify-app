"use client";

import React, { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutButton;
