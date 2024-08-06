import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';
import { User as NextAuthUser } from 'next-auth';
import { ISubscription, IWaitListed } from '../userModel';

interface SessionUser extends NextAuthUser {
  name: string;
  email: string;
  image: string;
  discordId?: string;
  customerId?: string;
  subscriptions: ISubscription[];
  referral?: {
    referral_code: string | null;
    referred_by: string | null;
    referral_count: number;
    valid_referrals: string[];
    valid_referral_count: number;
    rewards_claimed: number;
  };
  waitlisted?: {
    position: number;
  };
  username: string;
  currency?: 'GBP' | 'USD' | 'EUR';
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: SessionUser;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
    username?: string;
    currency?: 'GBP' | 'USD' | 'EUR';
  }
}
