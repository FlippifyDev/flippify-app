import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { linkTracker } from './services/firebase/link-tracker';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const ref = url.searchParams.get('ref'); // Get the 'ref' parameter from the query string

    if (ref) {
        // Track the `ref` parameter in the database
        await linkTracker(ref);
        url.pathname = '/l/home';
        return NextResponse.redirect(url);
    }

    // Allow other requests to proceed as normal
    return NextResponse.next();
}

// Configure the matcher to cover all paths, allowing `ref` tracking globally
export const config = {
    matcher: '/:path*', // Match all paths
};
