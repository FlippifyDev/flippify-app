import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';
import retrieveStripeCustomer from '../stripe-handlers/retrieve-customer';


mongoose.connect(process.env.MONGO_URL as string);

const UserSchema = new mongoose.Schema({
  name: String,
  discordId: String,
  email: String,
  stripeCustomerId: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

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

      const stripeCustomer = await retrieveStripeCustomer(
        token.id as string,
        token.name as string,
        token.email as string
      );

      (session.user as { customerId?: string }).customerId = stripeCustomer.id;

      return session;
    },
    async signIn({ profile }) {
      try {
        const { id, username, email } = profile as { id: string; username: string; email: string };

        await User.findOneAndUpdate(
          { discordId: id },
          { username, email },
          { upsert: true }
        );

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
};

export { authOptions };
