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
                router.push(`/loading`)
            )
        }
        }
      }, [session, router]);
    
    const handleSignIn = () => {
        signIn('discord');
    };
    
    return (
        <button className="btn btn-primary bg-discordBlue border-white text-white border-1" onClick={handleSignIn}>Subscribe Now</button>
    )
}

export default SignInWithDiscord