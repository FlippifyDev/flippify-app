'use client';

import React from 'react'
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


const SignInWithDiscord = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            // Redirect to the username-specific URL
            {session.user?.name ? (
                router.push(`/u/${session.user.name}/plans`)
            ) : (
                router.push(`/u/loading`)
            )
        }
        }
      }, [session, router]);
    
    const handleSignIn = () => {
        signIn('discord');
    };
    
    return (
        <button className="btn bg-white text-black rounded-lg mr-1 hover:bg-textGradStart hover:border-white transition-color duration-300" onClick={handleSignIn}>Get Early Access</button>
    )
}

export default SignInWithDiscord