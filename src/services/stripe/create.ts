"use server"

// Local Imports
import { firestore } from '@/lib/firebase/config';
import { IUser } from '@/models/user';

// External Imports
import { doc, getDoc } from 'firebase/firestore';
import Stripe from 'stripe';


const createBillingPortalUrl = async (username: string, customerId: string) => {
    const stripeAPIKey = process.env.TEST_STRIPE_SECRET_KEY as string;
    const root = process.env.ROOT as string;

    console.log('stripeAPIKey:', stripeAPIKey);

    if (!stripeAPIKey) {
        throw new Error('Stripe api key not found (createBillingPortalUrl)');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const billingPortal = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${root}/u/${username}/dashboard`
        })

        return billingPortal["url"]
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};


const createCheckoutSession = async (
    username: string,
    customerId: string,
    priceId: string,
    referredBy: string | null | undefined
): Promise<string | null> => {
    const stripeAPIKey = process.env.TEST_STRIPE_SECRET_KEY as string;
    const root = process.env.ROOT as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found (createCheckoutSession)');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const successUrl = `${root}/u/${username}/dashboard`;
        const cancelUrl = `${root}/u/${username}/plans`;

        let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];

        if (referredBy) {
            const userRef = doc(firestore, `users/${referredBy}`);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const referredUser = userSnapshot.data() as IUser;
                // Check if referredUser has any subscriptions with "member" in the name
                const hasMemberSubscription = referredUser.subscriptions?.some(subscription =>
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


const createAndApplyCoupon = async (subscriptionName: string | null, customerId: string, percentOff: number) => {
    const stripeAPIKey = process.env.TEST_STRIPE_SECRET_KEY as string;
    const root = process.env.ROOT as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe api key not found (createAndApplyCoupon)');
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


export { createBillingPortalUrl, createCheckoutSession, createAndApplyCoupon };
