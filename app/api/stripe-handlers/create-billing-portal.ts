import Stripe from 'stripe';


const createBillingPortalUrl = async ( username: string, customerId: string) => {
    const stripeAPIKey = process.env.STRIPE_SECRET_KEY as string;
    const root = "https://flippify.co.uk"
    const local = "http://localhost:3000"

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