// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { linkTracker } from './app/api/auth-firebase/linkTracker'; // Adjust import based on your actual setup

// Define the paths you want to track
const TRACKED_PATHS = new Set(['/reselling', '/monitors', '/join', '/sign-up', '/plans']);

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Check if the URL path is in the set of paths to track
  if (TRACKED_PATHS.has(url.pathname)) {
    // Track the access
    await linkTracker(url.pathname);

    // Redirect to the desired page
    url.pathname = '/l/home';
    return NextResponse.redirect(url);
  }

  // Allow other requests to proceed as normal
  return NextResponse.next();
}

// Configure the matcher to cover all the tracked paths
export const config = {
  matcher: ['/', '/reselling', '/monitors', '/join', '/sign-up', '/plans'],
};