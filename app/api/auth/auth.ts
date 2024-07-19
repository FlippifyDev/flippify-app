import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';
import { Types } from 'mongoose';

import retrieveStripeCustomer from '../stripe-handlers/retrieve-customer';
import { User, ISubscription, IWaitListed, IReferral } from '../userModel';

// Import and apply mongoose-long plugin
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
          // Attach referral data if available
          if (userFromDb.referral) {
            token.referral = userFromDb.referral;
          }
          // Attach waitlisted data if available
          if (userFromDb.waitlisted) {
            token.waitlisted = userFromDb.waitlisted;
          }
        }
      }

      return token;
    },
    async session({ session, token }) {
      const { id, name, email, referral, waitlisted } = token as {
        id: string;
        name: string;
        email: string;
        referral?: IReferral;
        waitlisted?: IWaitListed;
      };

      // Retrieve user from database
      const user = await User.findOne({ discord_id: Long.fromString(id) });
      if (!user) {
        console.error(`User not found in database for id ${id}`);
        return session;
      }

      // Retrieve the Stripe customer
      const stripeCustomer = await retrieveStripeCustomer(id, name, email);
      if (!stripeCustomer) {
        console.error(`Stripe customer not found for id ${id}`);
        return session;
      }

      // Attach additional data to session
      (session.user as { discordId?: string }).discordId = id;
      (session.user as { customerId?: string }).customerId = stripeCustomer.id;
      (session.user as { subscriptions?: ISubscription[] }).subscriptions = user.subscriptions;
      (session.user as { referral?: IReferral }).referral = user.referral || referral;
      (session.user as { waitlisted?: IWaitListed }).waitlisted = user.waitlisted || waitlisted;

      return session;
    },
    async signIn({ profile }: any) {
      try {
        const { id, username, email } = profile as { id: string; username: string; email: string };

        // Check if the user already exists
        const existingUser = await User.findOne({ discord_id: Long.fromString(id) });

        if (!existingUser) {
          const stripeCustomer = await retrieveStripeCustomer(id, username, email);
          if (!stripeCustomer) {
            console.error(`Stripe customer not found for id ${id}`);
            return false;
          }

          // Create the stripe customer
          try {
            const discordId = Long.fromString(id);
            const customer_id = stripeCustomer.id;
            const subscriptions: ISubscription[] = [];
            const referral: IReferral = {
              referral_code: generateReferralCode(),
              referred_by: null,
              referral_count: 0,
            };

            await User.findOneAndUpdate(
              { discord_id: discordId },
              { username: username, email, stripe_customer_id: customer_id, subscriptions, referral },
              { upsert: true }
            );

          } catch (error) {
            console.error('Error updating user:', error);
            return false;
          }
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
