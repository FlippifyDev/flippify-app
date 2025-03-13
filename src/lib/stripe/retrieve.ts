import Stripe from 'stripe';

const retrieveStripeCustomer = async (customerId: string | null, email: string, referralCode: string | null) => {
    const stripeAPIKey = process.env.TEST_STRIPE_SECRET_KEY as string;

	if (!stripeAPIKey) {
		throw new Error('Stripe API key not found');
	}

	const stripe = new Stripe(stripeAPIKey);

	try {
		let customer;

		if (customerId) {
			customer = await stripe.customers.retrieve(customerId);

			// Ensure the customer exists before trying to use it
			if (customer && !customer.deleted) {
				return customer;
			}
		}

		// If customerId was not provided or customer was not found, check by email
		const customers = await stripe.customers.list({
			email: email,
			limit: 1,
		});

		if (customers.data.length > 0) {
			customer = customers.data[0];
			return customer;
		} else {
			// Create a new customer since one doesn't exist with the provided email
			customer = await stripe.customers.create({
				email: email,
                metadata: {
                    referralCode: referralCode
                }
			});
			return customer;
		}
	} catch (error) {
		console.error('Error retrieving customer:', error);
		throw error;
	}
};

export default retrieveStripeCustomer;
