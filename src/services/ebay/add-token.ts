import { Session } from 'next-auth';

import { User } from '@/models/mongodb/users';
import { IEbayTokenData } from '@/models/firebase';
import connectToMongoDB from '@/lib/mongo/client';

async function addEbayTokens(tokenData: IEbayTokenData, session: Session) {
	try {
		// Ensure database connection 
		await connectToMongoDB();

		const customerId = session.user.customerId;

		// Check if the customerId exists
		if (!customerId) {
			return { error: 'Customer ID is missing from the session' };
		}

		// Find the user based on stripe_customer_id
		const user = await User.findOne({ stripe_customer_id: customerId });

		if (!user) {
			return { error: 'User not found' };
		}

		if (!user.ebay) {
			// Initialize ebay object if it doesn't exist
			user.ebay = {};
		}

		// Update the eBay tokens in the user object
		user.ebay.ebayAccessToken = tokenData.access_token;
		user.ebay.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000; // Convert seconds to milliseconds
		user.ebay.ebayRefreshToken = tokenData.refresh_token;

		// Save the user with updated eBay tokens
		await user.save();

		return { error: null };

	} catch (error) {
		console.error('Error adding eBay tokens:', error);
		return { error: 'An error occurred while adding eBay tokens' };
	}
}

export { addEbayTokens };
