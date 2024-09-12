'use client';

import React from 'react'
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';



const HomeGetEarlyAccess = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            // Redirect to the username-specific URL
            {session.user?.name ? (
                router.push(`/u/${session.user.name}/dashboard`)
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
        <button className="btn bg-white text-black rounded-lg mr-1 hover:text-white hover:bg-houseHoverBlue hover:shadow-lg hover:pb-[2px] border-none transform-duration-400 transition-duration-400" onClick={handleSignIn}>Get Access Now</button>
    )
}

export default HomeGetEarlyAccess