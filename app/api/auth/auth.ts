import DiscordProvider from 'next-auth/providers/discord';
import { AuthOptions } from 'next-auth';
import connectDB from '../auth-mongodb/dbConnect';  // Import your dbConnect function
import retrieveStripeCustomer from '../stripe-handlers/retrieve-customer';
import { User, ISubscription, IReferral } from '../auth-mongodb/userModel';

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
      // This callback runs during the login process, and stores the user info into the JWT token
      if (user) {
        token.id = user.id;  // Save the user's Discord ID into the token
        token.name = user.name;
        token.email = user.email;
      }

      // Fetch additional user data from MongoDB if the token contains a user ID
      if (token.id) {
        await connectDB();  // Ensure MongoDB connection before querying
        const userFromDb = await User.findOne({ discord_id: token.id });
        if (userFromDb) {
          token.subscriptions = userFromDb.subscriptions;  // Add subscriptions from MongoDB to the token
          token.accessGranted = userFromDb.subscriptions.some(sub => sub.name === 'accessGranted');
          token.username = userFromDb.username;
          token.referral = userFromDb.referral;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Extract data from the token to pass it to the session
      const { id, name, email, subscriptions, username, referral } = token as {
        id: string;
        name: string;
        email: string;
        subscriptions?: ISubscription[];
        username?: string;
        referral?: IReferral;
      };

      // Connect to the database
      await connectDB();
      const user = await User.findOne({ discord_id: id });

      if (!user) {
        console.error(`User not found in database for id ${id}`);
        return session;
      }

      // Retrieve or create the Stripe customer and store the customer ID in the session
      const stripeCustomer = await retrieveStripeCustomer(user.stripe_customer_id, id, name, email);
      if (!stripeCustomer) {
        console.error(`Stripe customer not found for id ${id}`);
        return session;
      }

      // Add user details to the session object
      session.user.discordId = id;  // Discord ID
      session.user.customerId = stripeCustomer.id;  // Stripe Customer ID
      session.user.subscriptions = user.subscriptions;  // User's subscription info from MongoDB
      session.user.accessGranted = subscriptions?.some(sub => sub.name === 'accessGranted') ?? false;
      session.user.username = username || user.username;  // Set username
      session.user.referral = referral || user.referral;  // Referral data

      return session;  // Return the modified session object
    },

    async signIn({ profile }: any) {
      await connectDB();  // Ensure MongoDB connection before querying
      try {
        const { id, username, email } = profile as { id: string; username: string; email: string };

        const existingUser = await User.findOne({ discord_id: id });

        if (!existingUser) {
          // If the user doesn't exist, create a new Stripe customer and store it in MongoDB
          const stripeCustomer = await retrieveStripeCustomer(null, id, username, email);
          if (!stripeCustomer) {
            console.error(`Stripe customer not found for id ${id}`);
            return false;
          }

          const customer_id = stripeCustomer.id;
          const subscriptions: ISubscription[] = [];
          const referral: IReferral = {
            referral_code: generateReferralCode(),
            referred_by: null,
            referral_count: 0,
            valid_referrals: [],
            rewards_claimed: 0,
          };

          // Create a new user in MongoDB
          await User.findOneAndUpdate(
            { discord_id: id },
            { username, email, stripe_customer_id: customer_id, subscriptions, referral },
            { upsert: true }
          );
        }

        return true;  // Sign-in is successful
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
};

export { authOptions };
