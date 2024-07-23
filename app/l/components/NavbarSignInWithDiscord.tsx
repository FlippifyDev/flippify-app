'use client';
import Loading from '../../components/Loading'; 

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa6';



const NavbarSignInWithDiscord = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session) {
            if (session.user?.name) {
                router.push(`/u/${session.user.name}/dashboard`);
            } else {
                router.push(`/u/loading`);
            }
        }
    }, [session, router]);
    
    const handleSignIn = async () => {
        setIsLoading(true); 
        signIn('discord');
        setIsLoading(false);
    };
    
    return (
        <div>
            <button className="btn btn-primary text-white bg-discordBlue border-discordBlue lg:w-56" onClick={handleSignIn}>
                <FaDiscord className="text-xl lg:mr-2 sm:text-3xl" /> 
                <span className='sm:inline md:hidden lg:inline text-xs sm:text-sm'>Sign in with Discord</span>
            </button>
            {isLoading && (
                <div className="mt-4">
                    <Loading />
                </div>
            )}
        </div>
    )
}

export default NavbarSignInWithDiscord;