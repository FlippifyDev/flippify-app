import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';
import { Types } from 'mongoose';
import retrieveStripeCustomer from '../stripe-handlers/retrieve-customer';
import { User, ISubscription, IWaitListed, IReferral } from '../auth-mongodb/userModel';

const mongooseLong = require('mongoose-long')(mongoose);
const Long = Types.Long;

mongoose.connect(process.env.MONGO_URL as string);

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 10);
};

const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      if (token.id) {
        const userFromDb = await User.findOne({ discord_id: Long.fromString(token.id as string) });
        if (userFromDb) {
          token.referral = {
            referral_code: userFromDb.referral?.referral_code || null,
            referred_by: userFromDb.referral?.referred_by || null,
            referral_count: userFromDb.referral?.referral_count || 0,
            valid_referral_count: userFromDb.referral?.valid_referral_count || 0,
            rewards_claimed: userFromDb.referral?.rewards_claimed || 0, 
          };
          token.waitlisted = userFromDb.waitlisted ? { position: userFromDb.waitlisted.position ?? -1 } : undefined;
          token.username = userFromDb.username;
          token.currency = userFromDb.currency || 'GBP';  // Add currency to the token
        }
      }

      return token;
    },
    async session({ session, token }) {
      const { id, name, email, waitlisted, username, currency } = token as {
        id: string;
        name: string;
        email: string;
        referral?: IReferral;
        waitlisted?: IWaitListed;
        username?: string;
        currency?: 'GBP' | 'USD' | 'EUR';
      };

      const user = await User.findOne({ discord_id: Long.fromString(id) });
      if (!user) {
        console.error(`User not found in database for id ${id}`);
        return session;
      }

      const stripeCustomer = await retrieveStripeCustomer(id, name, email);
      if (!stripeCustomer) {
        console.error(`Stripe customer not found for id ${id}`);
        return session;
      }

      session.user.discordId = id;
      session.user.customerId = stripeCustomer.id;
      session.user.subscriptions = user.subscriptions;
      session.user.referral = {
        referral_code: user.referral?.referral_code || null,
        referred_by: user.referral?.referred_by || null,
        referral_count: user.referral?.referral_count || 0,
        valid_referrals: user.referral?.valid_referrals || [],
        valid_referral_count: user.referral?.valid_referral_count || 0, 
        rewards_claimed: user.referral?.rewards_claimed || 0, 
      };
      session.user.waitlisted = user.waitlisted ? { position: user.waitlisted.position ?? -1 } : waitlisted;
      session.user.username = username || user.username;
      session.user.currency = currency || user.currency || 'GBP';  // Add currency to the session

      return session;
    },
    async signIn({ profile }: any) {
      try {
        const { id, username, email } = profile as { id: string; username: string; email: string };

        // Deny sign-in if email is not present
        if (!email) {
          console.error(`Sign-in attempt without email for user ${username}`);
          return false;
        }

        const existingUser = await User.findOne({ discord_id: Long.fromString(id) });

        if (!existingUser) {
          const stripeCustomer = await retrieveStripeCustomer(id, username, email);
          if (!stripeCustomer) {
            console.error(`Stripe customer not found for id ${id}`);
            return false;
          }

          const discordId = Long.fromString(id);
          const customer_id = stripeCustomer.id;
          const subscriptions: ISubscription[] = [];
          const referral: IReferral = {
            referral_code: generateReferralCode(),
            referred_by: null,
            referral_count: 0,
            valid_referral_count: 0,
            valid_referrals: [],
            rewards_claimed: 0,
          };

          await User.findOneAndUpdate(
            { discord_id: discordId },
            { username, email, stripe_customer_id: customer_id, subscriptions, referral, currency: 'GBP' },
            { upsert: true }
          );
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
};

export { authOptions };
