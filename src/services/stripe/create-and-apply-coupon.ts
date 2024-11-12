import Stripe from 'stripe';



const createAndApplyCoupon = async (subscriptionName: string | null, customerId: string, percentOff: number) => {
	const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

	if (!stripeAPIKey) {
		throw new Error('Stripe api key not found');
	}

	const stripe = new Stripe(stripeAPIKey);

	try {

		// Step 1: Retrieve the customer to ensure they exist
		const customer = await stripe.customers.retrieve(customerId);
		if (!customer) {
			throw new Error(`Customer with ID ${customerId} not found`);
		}

		// Step 2: Retrieve active subscriptions of the customer
		const subscriptions = await stripe.subscriptions.list({
			customer: customerId,
			status: 'active',
		});

		if (subscriptions.data.length === 0) {
			throw new Error(`No active subscriptions found for customer with ID ${customerId}`);
		}


		// Step 3: Create the coupon with the specified percentOff
		const coupon = await stripe.coupons.create({
			percent_off: percentOff,
			duration: 'once',
		});

		// Step 4: Find the subscription that matches the given subscriptionName
		let matchingSubscription = null;

		for (const subscription of subscriptions.data) {
			// Get the subscription items (each subscription can have multiple items)
			const subscriptionItems = subscription.items.data;

			// Check if any of the subscription items match the given subscription name
			for (const item of subscriptionItems) {
				const product = await stripe.products.retrieve(item.price.product as string);

				// Match the product's name to the provided subscriptionName
				if (product.name === subscriptionName) {
					matchingSubscription = subscription;
					break;
				}
			}

			if (matchingSubscription) {
				break;
			}
		}

		if (!matchingSubscription) {
			throw new Error(`No subscription found with the name "${subscriptionName}" for customer with ID ${customerId}`);
		}

		// Step 5: Apply the coupon to the matched subscription
		await stripe.subscriptions.update(matchingSubscription.id, {
			discounts: [{
				coupon: coupon.id,
			}],
		});

		return true;

	} catch (error) {
		console.error('Error creating coupon:', error);
		throw error;
	}
};

export default createAndApplyCoupon