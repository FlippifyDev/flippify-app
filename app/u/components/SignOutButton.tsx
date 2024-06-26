"use client"

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        
        if (!session) {
            router.push(`/l/home`)
        }
        
    }, [router]);

    const handleSignOut = () => {
        signOut()
    }
    return (
        <button className="btn btn-ghost" onClick={handleSignOut}>Sign Out</button>
    )
}

export default SignOutButton
