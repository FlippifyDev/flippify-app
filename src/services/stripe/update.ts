"use server"

// Local Imports
import { retrieveCouponCodeOrPromotionCode } from "./retrieve";

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


export async function updateStripeUserSubscription(customerId: string, newPriceId: string, coupon?: string): Promise<{ success?: boolean, error?: string }> {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe API key not found');
    }

    const stripe = new Stripe(stripeAPIKey);

    let currentSubscriptionId;
    let subItemId;
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
        });
        currentSubscriptionId = subscriptions.data[0]?.id;
        subItemId = subscriptions.data[0]?.items.data[0]?.id;
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
    }

    if (!currentSubscriptionId || !subItemId) {
        console.error('No active subscription found for the customer.');
        return { error: 'No active subscription found for the customer.' };
    }

    try {
        let discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
        
        if (coupon) {
            const { coupon: couponCode, promotionCode, promoId } = await retrieveCouponCodeOrPromotionCode(coupon ?? "");
            if (!couponCode && !promotionCode) {
                return { error: "Invalid coupon code" };
            }
            if (couponCode) {
                discounts.push({ coupon: coupon });
            } else if (promotionCode && promoId) {
                discounts.push({ promotion_code: promoId });
            }
        }

        await stripe.subscriptions.update(
            currentSubscriptionId, {
            items: [
                {
                    id: subItemId,
                    deleted: true,
                },
                {
                    price: newPriceId,
                    discounts: discounts
                },
            ],
        });

        return { success: true };
    } catch (error) {
        console.error('Error updating subscription:', error);
        return { error: `${error}` };
    }
}