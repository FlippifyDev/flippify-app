'use client';

import React from 'react'
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa6';

const SignInWithDiscord = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            // Redirect to the username-specific URL
            {session.user?.name ? (
                router.push(`/u/${session.user.name}`)
            ) : (
                router.push(`/l/home`)
            )
        }
        }
      }, [session, router]);
    
    const handleSignIn = () => {
        signIn('discord');
    };
    
    return (
        <button className="btn btn-primary text-white bg-discordBlue" onClick={handleSignIn}><FaDiscord className="text-3xl mr-2"/>Sign in with Discord</button>
    )
}

export default SignInWithDiscord
