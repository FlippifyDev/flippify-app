import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';

import { User as NextAuthUser } from 'next-auth';
import { ISubscription, IWaitListed } from '../userModel'; // Adjust import based on your file structure

interface SessionUser extends NextAuthUser {
  name: string;
  email: string
  image: string;
  discordId?: string;
  customerId?: string;
  subscriptions: ISubscription[];
  referral?: {
    referral_code: string | null;
    referred_by: string | null;
    referral_count: number;
  }
  waitlisted?: {
    position: number;
  };
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: SessionUser;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
  }
}
