"use server"

import { User, IUser } from '../auth-mongodb/userModel'; // Ensure the correct path is used
import Stripe from 'stripe';

const createCheckoutSession = async (
    username: string,
    customerId: string,
    priceId: string,
    referred_by: string | null | undefined
): Promise<string | null> => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;
    const root = process.env.ROOT as string;
    
    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const successUrl = `${root}/u/${username}/dashboard`;
        const cancelUrl = `${root}/u/${username}/plans`;

        // If referred_by is provided, attempt to find a matching referral_code
        let referredUser: IUser | null = null;
        let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

        if (referred_by) {
            referredUser = await User.findOne({ 'referral.referral_code': referred_by });
            
            if (referredUser) {
                // Check if referredUser has any subscriptions with "member" in the name
                const hasMemberSubscription = referredUser.subscriptions.some(subscription =>
                    subscription.name.toLowerCase().includes('member')
                );

                if (hasMemberSubscription) {
                    // Add the coupon code to discounts if condition is met
                    discounts.push({
                        coupon: 'QvLHMMGH', // Stripe coupon code 25% off
                    });
                }
            }
        }

        // Create the checkout session with the optional coupon if applicable
        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            // Apply the discounts if the coupon is added
            discounts: discounts.length > 0 ? discounts : undefined,
        });

        return checkoutSession.url;
    } catch (error) {
        throw error;
    }
};

export default createCheckoutSession;
