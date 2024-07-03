'use client';
import Loading from '../../components/Loading'; 

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa6';



const SignInWithDiscord = () => {
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
            <button className="btn btn-primary text-white bg-discordBlue border-discordBlue" onClick={handleSignIn}>
                <FaDiscord className="text-3xl mr-2" /> Sign in with Discord
            </button>
            {isLoading && (
                <div className="mt-4">
                    <Loading />
                </div>
            )}
        </div>
    )
}

export default SignInWithDiscord;