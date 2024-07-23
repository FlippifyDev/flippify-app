'use client';
import Loading from '../../components/Loading'; 

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NavbarSignInWithDiscordSideBar = () => {
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
            <button className="lg:w-56" onClick={handleSignIn}>
                Sign In
            </button>
            {isLoading && (
                <div className="mt-4">
                    <Loading />
                </div>
            )}
        </div>
    )
}

export default NavbarSignInWithDiscordSideBar;