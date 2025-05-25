"use client";

import { auth } from "@/lib/firebase/config";
import { signOut as nextSignOut } from 'next-auth/react';
import { signOut as firebaseSignOut } from 'firebase/auth';


export async function handleSignOut() {
    try {
        await firebaseSignOut(auth);
        await nextSignOut({ callbackUrl: '/l/home' });
    } catch (error) {
        console.log(error)
    }
}