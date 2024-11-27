import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signInUser, signOutUser } from '@/src/lib/firebase/client';
import { linkTracker } from './src/services/firebase/link-tracker';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const ref = url.searchParams.get('ref'); 

    if (ref) {
        try {
			await signInUser()
            await linkTracker(ref);
			await signOutUser()
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
