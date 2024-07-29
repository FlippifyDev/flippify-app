import Stripe from 'stripe';


const retrieveStripeCustomer = async (discordId: string, username: string, email: string) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe api key not found');
    }
    
    const stripe = new Stripe(stripeAPIKey);

    try {
        // Check if customer with the provided email already exists
        let customer = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (customer.data.length > 0) {
            // Customer already exists, return the existing customer
            return customer.data[0];
        } else {
            // Create a new customer since one doesn't exist with the provided email
            const customer = await stripe.customers.create({
                email: email,
                metadata: {
                    discord_id: discordId,
                    discord_username: username,
                },
            });
            return customer;
        }
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};

export default retrieveStripeCustomer