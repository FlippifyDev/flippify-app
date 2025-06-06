"use client";

// Local Imports
import { auth } from "@/lib/firebase/config";

// External Imports
import { signOut as firebaseSignOut } from 'firebase/auth';
import { signOut as nextSignOut } from 'next-auth/react';

const SignOutButton = () => {
    function handleSignOut() {
        nextSignOut({ callbackUrl: '/l/home' });
        firebaseSignOut(auth);
    }
    return (
        <button onClick={handleSignOut} className='hover:bg-blue-600 bg-[#1a73e8] p-3 rounded-lg font-sans font-[500] text-white'>Sign Out</button>
    )
}


export const SignOutLink = () => {
    function handleSignOut() {
        nextSignOut({ callbackUrl: '/l/home' });
        firebaseSignOut(auth);
    }
    return (
        <button onClick={handleSignOut} className='hover:text-blue-700 text-blue-600 hover:underline p-3 rounded-lg font-sans font-semibold transition-all duration-300'>Sign Out</button>
    )
}

export default SignOutButton
