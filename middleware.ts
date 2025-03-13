// Local Imports
//import { linkTracker } from './src/services/firebase/link-tracker';
import { auth } from '@/lib/firebase/config';
import { signOut as firebaseSignOut } from 'firebase/auth';

// External Imports
import { signOut as nextSignOut } from 'next-auth/react';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const ref = url.searchParams.get('ref');

    if (ref) {
        try {
            //await signInUser()
            //await linkTracker(ref);
            //await nextSignOut()
            //await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error while updating link count:', error);
        }

        url.pathname = '/l/home';
        url.searchParams.delete('ref'); // Ensure 'ref' is removed from the URL
        return NextResponse.redirect(url);
    }

    // Allow other requests to proceed as normal
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Match all paths
};
