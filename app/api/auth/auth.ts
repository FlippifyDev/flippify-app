import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import mongoose from 'mongoose';
import retrieveStripeCustomer from '../stripe-handlers/retrieve-customer';


mongoose.connect(process.env.MONGO_URL as string);

const UserSchema = new mongoose.Schema({
  discord_id: Number,
  username: String,
  email:String,
  stripe_customer_id:String,
  active_roles:[Number],
});

const User = mongoose.models.users || mongoose.model('users', UserSchema);

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
	  
	  // Retrieve the Stripe customer
      const stripeCustomer = await retrieveStripeCustomer(id, name, email);
      if (!stripeCustomer) {
        console.error(`Stripe customer not found for id ${id}`);
        return session;
      }

      (session.user as { customerId?: string }).customerId = stripeCustomer.id;
    
      return session;
    },
    async signIn({ profile }: any) {
      try {
        const { id, username, email } = profile as { id: string; username: string; email: string };

		const stripeCustomer = await retrieveStripeCustomer(id, username, email);
		if (!stripeCustomer) {
			console.error(`Stripe customer not found for id ${id}`);
			return false;
		}
		
		// Create the stripe customer
		try {
			const discordId: number = Number(id);
			const customer_id = stripeCustomer.id
			const active_roles: number[] = [];
			await User.findOneAndUpdate(
			  { discord_id: discordId },
			  { username: username, email, stripe_customer_id: customer_id, active_roles },
			  { upsert: true }
			);
	
		  } catch (error) {
			console.error('Error updating user:', error);
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