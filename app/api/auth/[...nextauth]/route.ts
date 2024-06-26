import NextAuth, { AuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { User as NextAuthUser } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URL as string);

const UserSchema = new mongoose.Schema({
  name: String,
  discordId: String,
  email: String,
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
    async jwt({ token, account }: { token: JWT; account?: any }): Promise<JWT> {
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.accessToken = token.accessToken as string;
      return session;
    },
    async signIn({ profile }: { profile?: any }): Promise<boolean> {
      const { id, username, email } = profile as { id: string; username: string; email: string };
      await User.findOneAndUpdate(
        { discordId: id },
        { name: username, email },
        { upsert: true }
      );
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
