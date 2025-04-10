// External Imports
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const ref = url.searchParams.get('ref');

    if (ref) {
        try {
            await fetch(`${url.origin}/api/link-tracker`, {
                method: 'POST',
                body: JSON.stringify({ ref }),
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Error while updating link count:', error);
        }

        url.pathname = '/l/home';
        url.searchParams.delete('ref');
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Match all paths
};
