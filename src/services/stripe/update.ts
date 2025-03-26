// External Imports
import Stripe from "stripe";

export async function updateStripeCustomerEmail(customerId: string, newEmail: string) {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const updatedCustomer = await stripe.customers.update(customerId, {
            email: newEmail,
        });

        return updatedCustomer;
    } catch (error) {
        console.error('Error updating customer email:', error);
        throw error;
    }
}