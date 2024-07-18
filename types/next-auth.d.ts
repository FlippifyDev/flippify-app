import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';


import { User as NextAuthUser } from 'next-auth';
import { ISubscription, IWaitListed } from '../userModel'; // Adjust import based on your file structure

interface CustomUser extends NextAuthUser {
  name: string;
  discordId?: string;
  customerId?: string;
  image: string;
  subscriptions: ISubscription[];
  waitlisted?: {
    position: number;
    referral_code: string | null;
    referral_count: number;
  };
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: CustomUser;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
  }
}
