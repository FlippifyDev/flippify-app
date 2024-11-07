import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';
import { User as NextAuthUser } from 'next-auth';
import { ISubscription } from '../userModel';

type CurrencyType = 'GBP' | 'USD' | 'EUR';

interface SessionUser extends NextAuthUser {
  name: string;
  email: string;
  image: string;
  discordId: string;
  customerId?: string;
  subscriptions: ISubscription[];
  referral?: {
    referral_code: string | null;
    referred_by: string | null;
    valid_referrals: string[];
    referral_count: number;
    rewards_claimed: number;
  };
  accessGranted?: boolean;
  username: string;
  currency?: CurrencyType;
  ebay?: {
    ebayAccessToken: string | null;
    ebayRefreshToken: string | null;
    ebayTokenExpiry: number | null;
  };
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

  interface NextApiRequest {
    session: Session;
  }
}
