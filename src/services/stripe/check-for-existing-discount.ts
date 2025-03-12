import Stripe from 'stripe';


const checkForExistingDiscount = async (customerId: string) => {
	const stripeAPIKey = process.env.TEST_STRIPE_SECRET_KEY as string;

	if (!stripeAPIKey) {
		throw new Error('Stripe API key not found');
	}

	const stripe = new Stripe(stripeAPIKey);

	try {
		// Step 1: Retrieve active subscriptions of the customer
		const subscriptions = await stripe.subscriptions.list({
			customer: customerId,
			status: 'active',
		});

		if (subscriptions.data.length === 0) {
			return false; // No active subscriptions
		}

		// Step 2: Check each subscription for discounts
		for (const subscription of subscriptions.data) {
			if (subscription.discounts && subscription.discounts.length > 0) {
				return true; // Discount found
			}
		}

		return false; // No discounts found

	} catch (error) {
		console.error('Error checking for existing discounts:', error);
		throw error;
	}
};

export default checkForExistingDiscount;