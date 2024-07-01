// path: /app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '../auth'; // Adjust the relative path to auth.ts

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
