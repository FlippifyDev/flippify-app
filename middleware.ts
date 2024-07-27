// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { linkTracker } from './app/api/linkTracker'; // Adjust import based on your actual setup

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Check if the URL is the specific path we want to track and redirect
  if (url.pathname === '/reselling') {
    // Track the access
    await linkTracker(url.pathname);

    // Redirect to the desired page
    url.pathname = '/l/home';
    return NextResponse.redirect(url);
  }

  // Allow other requests to proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: '/reselling',
};
