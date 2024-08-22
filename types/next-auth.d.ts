import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';
import { User as NextAuthUser } from 'next-auth';
import { ISubscription } from '../userModel';

type CurrencyType = 'GBP' | 'USD' | 'EUR';

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
  accessGranted?: boolean;  // New property to track access status
  username: string;
  currency?: CurrencyType;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: SessionUser;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
    username?: string;
    currency?: CurrencyType;
  }
}
