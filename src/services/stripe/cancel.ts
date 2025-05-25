"use server";

import Stripe from "stripe";

export async function cancelUserSubscription(customerId: string): Promise<{ success?: boolean, error?: any, isNoSubscriptionError?: boolean }> {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
        });
        const subscriptionId = subscriptions.data[0]?.id;

        if (!subscriptionId) {
            return { error: `Customer ${customerId} has no subscription ${subscriptionId}`, isNoSubscriptionError: true }
        }

        await stripe.subscriptions.cancel(
            subscriptionId
        );

        return { success: true };
    } catch (error) {
        console.log(`Error in cancelUserSubscription(${customerId})`, error)
        return { error: `${error}` }
    }
}   