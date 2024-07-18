import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose, { Document, Model } from 'mongoose';
import retrieveStripeCustomer from '../stripe-handlers/retrieve-customer';
import { Types } from 'mongoose';

// Import and apply mongoose-long plugin
const mongooseLong = require('mongoose-long')(mongoose);
const Long = Types.Long;


mongoose.connect(process.env.MONGO_URL as string);


// Define Subscription interface
interface ISubscription {
  name: string;
  role_id: typeof Long; // mongoose-long type for role_id
  override: boolean;
  server_subscription: boolean;
}


interface IUser extends Document {
  discord_id: typeof Long;
  username: string;
  email: string;
  stripe_customer_id: string;
  subscriptions: ISubscription[];
}

const UserSchema = new mongoose.Schema<IUser>({
  discord_id: {
    type: Long,
    required: true,
  },
  username: String,
  email: String,
  stripe_customer_id: String,
  subscriptions: [{
    name: { type: String, required: true },
    role_id: { type: Long, required: true },
    override: { type: Boolean, default: false },
    server_subscription: { type: Boolean, default: false },
  }],
});

const User: Model<IUser> = mongoose.models.users || mongoose.model<IUser>('users', UserSchema);

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
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {};
      }

      const { id, name, email } = token as { id: string; name: string; email: string };
      
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

      (session.user as { discordId?: string }).discordId = id;
      (session.user as { customerId?: string }).customerId = stripeCustomer.id;
      (session.user as { subscriptions?: ISubscription[] }).subscriptions = user.subscriptions;
    
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
            const subscriptions: ISubscription[] = []; // Initialize subscriptions only for new user

            await User.findOneAndUpdate(
              { discord_id: discordId },
              { username: username, email, stripe_customer_id: customer_id, subscriptions },
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