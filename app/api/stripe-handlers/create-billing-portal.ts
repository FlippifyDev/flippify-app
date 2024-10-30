import Stripe from 'stripe';


const createBillingPortalUrl = async ( username: string, customerId: string) => {
    const stripeAPIKey = process.env.LIVE_STRIPE_SECRET_KEY as string;
    const root = process.env.ROOT as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe api key not found');
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

export default createBillingPortalUrl