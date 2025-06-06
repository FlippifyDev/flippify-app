"use server"

// Local Imports
import { FREE_MONTHLY_PID } from '@/utils/constants';
import { retrieveRefereeUser } from '../firebase/admin-retrieve';
import { updateStripeUserSubscription } from './update';
import { retrieveCouponCodeOrPromotionCode } from './retrieve';

// External Imports
import Stripe from 'stripe';
import { validGroupCouponCodes } from './valid-group-coupon-codes.server';


const createBillingPortalUrl = async (username: string, customerId: string) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;
    const root = process.env.ROOT as string;

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
    referredBy?: string | null,
    code?: string
): Promise<{ url?: string | null, error?: string | null }> => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;
    const root = process.env.ROOT as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found (createCheckoutSession)');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        const successUrl = `${root}/u/${username}/dashboard`;
        const cancelUrl = `${root}/u/${username}/plans`;

        let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
        let subscription_data = {};

        // Check if the code is valid
        if (code) {
            const { coupon, promotionCode, promoId } = await retrieveCouponCodeOrPromotionCode(code);
            if (!coupon && !promotionCode) {
                return { error: "Invalid coupon code" };
            }
            if (coupon) {
                discounts.push({ coupon: code });
            } else if (promotionCode && promoId) {
                discounts.push({ promotion_code: promoId });
            }

            if (validGroupCouponCodes.includes(code)) {
                subscription_data = {
                    "trial_period_days": 14,
                }
            }
        }

        // If a coupon code is present, then disallow
        if (referredBy) {
            const referredUser = await retrieveRefereeUser({ referralCode: referredBy });

            if (referredUser) {
                // Check if referredUser has any subscriptions with "member" in the name
                const hasMemberSubscription = referredUser.subscriptions?.some(subscription =>
                    subscription.name?.toLowerCase().includes('member')
                );

                // Disallow the referral discount if a coupon code is present
                if (hasMemberSubscription && !code) {
                    // Add the coupon code to discounts if condition is met
                    discounts.push({
                        coupon: process.env.STRIPE_COUPON_CODE_25, // Stripe coupon code 25% off
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
            subscription_data,
            // Apply the discounts if the coupon is added
            discounts: discounts.length > 0 ? discounts : undefined,
        });

        return { url: checkoutSession.url };
    } catch (error) {
        console.log(error)
        return { error: `${error}` };
    }
};


const createAndApplyCoupon = async (subscriptionName: string | null, customerId: string, percentOff: number) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

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


export async function createRefund(customerId: string): Promise<{ success?: boolean, error?: any }> {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        createRefund
        throw new Error('Stripe api key not found (createRefund)');
    }

    const stripe = new Stripe(stripeAPIKey);

    try {
        // Step 1: List the most recent charges for the customer
        const charges = await stripe.charges.list({
            customer: customerId,
            limit: 1,
        });

        if (charges.data.length === 0) {
            throw new Error("No charges found for this customer.");
        }

        const charge = charges.data[0];

        // Step 2: Get the latest charge from the payment intent
        const chargeId = charge.id;

        if (!chargeId) {
            throw new Error("No charge found for this payment intent.");
        }

        // Step 3: Check if the charge occured in the previous 7 days
        const createdAt = charge.created
        const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
        if (createdAt < sevenDaysAgo) {
            throw new Error('Charge is older than 7 days and cannot be refunded automatically.');
        }

        // Step 4: Create the refund
        await stripe.refunds.create({
            charge: chargeId,
        });

        // Step 5: Update users subscription to the free plan
        const { error } = await updateStripeUserSubscription(customerId, FREE_MONTHLY_PID);
        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error("Refund error:", error);
        return { error: `${error}` }
    }
}


export { createBillingPortalUrl, createCheckoutSession, createAndApplyCoupon };
