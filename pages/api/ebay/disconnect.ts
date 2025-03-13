import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nookies from 'nookies';

import connectToMongoDB from '@/lib/mongo/client';
import { User } from '@/models/mongodb/users';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const session = await getSession({ req });

		if (!session || !session.user?.stripeCustomerId) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		const stripeCustomerId = session.user.stripeCustomerId;

		await connectToMongoDB();

		const user = await User.findOne({ stripe_customer_id: stripeCustomerId });
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Ensure eBay data exists
		if (!user.ebay) {
			return res.status(400).json({ error: 'No eBay data found for this user' });
		}

		// Remove the eBay tokens from the user object
		user.ebay.ebayAccessToken = undefined;
		user.ebay.ebayRefreshToken = undefined;
		user.ebay.ebayTokenExpiry = undefined;

		await user.save();

		// Clear the cookies to avoid auto-login on next connect
		nookies.destroy({ res }, 'ebay_oauth_state', { path: '/' });

		return res.status(200).json({ message: 'eBay account disconnected successfully' });
	} catch (error) {
		console.error('Error disconnecting eBay account:', error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
}
