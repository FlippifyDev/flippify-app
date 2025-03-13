"use client";

// Local Imports
import { auth } from "@/lib/firebase/config";

// External Imports
import { signOut as firebaseSignOut } from 'firebase/auth';
import { signOut as nextSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
    const router = useRouter();
    function handleSignOut() {
        nextSignOut();
        firebaseSignOut(auth);
        router.push("/l/home");
    }
    return (
        <button onClick={handleSignOut} className='hover:bg-blue-600 bg-[#1a73e8] p-3 rounded-lg font-sans font-[500]'>Sign Out</button>
    )
}

export default SignOutButton
