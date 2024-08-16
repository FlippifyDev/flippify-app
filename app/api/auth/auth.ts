import NextAuth, { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';
import { User } from '../auth-mongodb/userModel';
import { Types } from 'mongoose';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Initialize mongoose-long for handling Long types
const mongooseLong = require('mongoose-long')(mongoose);
const Long = Types.Long;

// Ensure mongoose is connected before running any queries
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URL as string);
}

// Define the ISubscription and IReferral types
interface ISubscription {
  name: string;
  role_id?: string;
  override?: boolean;
  server_subscription?: boolean;
}

interface IReferral {
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  valid_referral_count: number;
  rewards_claimed: number;
  valid_referrals: string[];
}

type CurrencyType = 'GBP' | 'USD' | 'EUR';

const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        const userFromDb = await User.findOne({ discord_id: Long.fromString(user.id.toString()) });

        if (userFromDb) {
          token.customerId = userFromDb.stripe_customer_id || '';
          token.discordId = userFromDb.discord_id?.toString() || '';
          token.subscriptions = userFromDb.subscriptions || [];
          token.currency = userFromDb.currency || 'GBP';
          token.referral = userFromDb.referral || null;
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        ...session.user,
        name: session.user?.name || token.name || '',
        email: session.user?.email || token.email || '',
        discordId: typeof token.discordId === 'string' ? token.discordId : '',
        customerId: typeof token.customerId === 'string' ? token.customerId : '',
        subscriptions: Array.isArray(token.subscriptions) ? token.subscriptions : [],
        currency: token.currency as CurrencyType || 'GBP',
        referral: token.referral as IReferral || undefined,
      };

      return session;
    },
  },
};

export { authOptions };
