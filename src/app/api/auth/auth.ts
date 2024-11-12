import DiscordProvider from 'next-auth/providers/discord';
import { AuthOptions } from 'next-auth';
import retrieveStripeCustomer from '../../../services/stripe/retrieve-customer';
import { User, ISubscription, IReferral } from '@/src/models/mongodb/users';
import { IJwtToken } from '@/src/models/jwt-token';
import connectToMongoDB from '@/src/lib/mongo/client';

const generateReferralCode = () => Math.random().toString(36).substring(2, 10);

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
				await connectToMongoDB();

				const userFromDb = await User.findOne({ discord_id: token.id });

				if (userFromDb) {
					token.subscriptions = userFromDb.subscriptions;
					token.accessGranted = userFromDb.subscriptions.some(sub => sub.name === 'accessGranted');
					token.username = userFromDb.username;
					token.referral = userFromDb.referral;
					token.ebayAccessToken = userFromDb.ebay?.ebayAccessToken || null;
					token.ebayTokenExpiry = userFromDb.ebay?.ebayTokenExpiry || null;
					token.ebayRefreshToken = userFromDb.ebay?.ebayRefreshToken || null;
				}
			}
			return token;
		},

		async session({ session, token }) {
			// Extract data from the token to pass it to the session
			const { id, name, email, subscriptions, username, referral, ebayAccessToken, ebayTokenExpiry, ebayRefreshToken } = token as IJwtToken;

			await connectToMongoDB();

			const user = await User.findOne({ discord_id: id });

			if (!user) {
				console.error(`User not found in database for id ${id}`);
				return session;
			}

			const stripeCustomer = await retrieveStripeCustomer(user.stripe_customer_id, id, name, email);
			if (!stripeCustomer) {
				return session;
			}

			session.user.discordId = id;
			session.user.customerId = stripeCustomer.id;
			session.user.subscriptions = user.subscriptions;
			session.user.accessGranted = subscriptions?.some(sub => sub.name === 'accessGranted') ?? false;
			session.user.username = username || user.username;
			session.user.referral = referral || user.referral;
			session.user.ebay = {
				ebayAccessToken: ebayAccessToken || null,
				ebayTokenExpiry: ebayTokenExpiry || null,
				ebayRefreshToken: ebayRefreshToken || null
			};

			return session;
		},

		async signIn({ profile }: any) {
			await connectToMongoDB();
			
			try {
				const { id, username, email } = profile as { id: string; username: string; email: string };

				const existingUser = await User.findOne({ discord_id: id });

				if (!existingUser) {
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

					await User.findOneAndUpdate(
						{ discord_id: id },
						{ username, email, stripe_customer_id: customer_id, subscriptions, referral },
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
