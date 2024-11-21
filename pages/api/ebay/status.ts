// External Imports
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

// Local Imports
import connectToMongoDB from '@/src/lib/mongo/client';
import { User } from '@/src/models/mongodb/users';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	// Ensure MongoDB is connected
	await connectToMongoDB();  

	const session = await getSession({ req });

	if (!session || !session.user?.customerId) {
		return res.status(401).json({ error: 'User not authenticated' });
	}

	const stripeCustomerId = session.user.customerId;  // Use Stripe customer ID

	try {
		const user = await User.findOne({ stripe_customer_id: stripeCustomerId });

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}

		// Check if eBay details exist under the "ebay" object
		const ebayData = user.ebay || {};

		res.status(200).json({
			stripeCustomerId: user.stripe_customer_id,
			ebay: {
				ebayAccessToken: ebayData.ebayAccessToken || null,
				ebayRefreshToken: ebayData.ebayRefreshToken || null,
				ebayTokenExpiry: ebayData.ebayTokenExpiry || null,
			},
		});
	} catch (error) {
		console.error('Error fetching eBay status:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
