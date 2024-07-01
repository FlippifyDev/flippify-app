import NextAuth, { AuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';

import retrieveStripeCustomer from '../../stripe-handlers/retrieve-customer';

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URL as string);

const UserSchema = new mongoose.Schema({
  name: String,
  discordId: String,
  email: String,
  stripeCustomerId: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);


export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any): Promise<JWT> {
      return { ...token, ...user}
    },
    async session({ session, token }: any): Promise<any> {
      const stripeCustomer = await retrieveStripeCustomer(token.id, token.name, token.email)

      if (token?.sub) {
        session.user.customerId = stripeCustomer.id;
      }
      return session;
    },
    async signIn({ profile }: any): Promise<boolean> {
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
        throw error;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
