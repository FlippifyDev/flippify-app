"use server";

import Stripe from 'stripe';


const retrieveStripeCustomer = async (customerId: string | null, email: string, referralCode: string | null) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

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
                return customer.id;
            }
        }

        // If customerId was not provided or customer was not found, check by email
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (customers.data.length > 0) {
            customer = customers.data[0];
            return customer.id;
        } else {
            // Create a new customer since one doesn't exist with the provided email
            customer = await stripe.customers.create({
                email: email,
                metadata: {
                    referralCode: referralCode
                }
            });
            return customer.id;
        }
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};

const checkForExistingDiscount = async (customerId: string) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found (checkForExistingDiscount)');
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

async function retrieveCouponCodeOrPromotionCode(code: string) {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found (checkForExistingDiscount)');
    }

    const stripe = new Stripe(stripeAPIKey);
    let coupon;
    let promotionCode;
    let promoId;
    try {
        await stripe.coupons.retrieve(code);
        coupon = true;
    } catch (error) {
        coupon = false;
    }

    try {
        const promotionCodes = await stripe.promotionCodes.list({
            limit: 100,
        });
        for (const promCode of promotionCodes.data) {
            if (promCode.code === code) {
                promotionCode = true;
                promoId = promCode.id;
                break;
            }
            promotionCode = false;
        }
    } catch (error) {
        promotionCode = false;
    }

    return { coupon, promotionCode, promoId };
}

export { retrieveStripeCustomer, checkForExistingDiscount, retrieveCouponCodeOrPromotionCode };