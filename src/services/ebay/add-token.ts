import { Session } from 'next-auth';


async function addEbayTokens(tokenData: any, session: Session) {
	try {
        /** 
		const customerId = session.user.stripeCustomerId;

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
        */

	} catch (error) {
		console.error('Error adding eBay tokens:', error);
		return { error: 'An error occurred while adding eBay tokens' };
	}
}

export { addEbayTokens };
