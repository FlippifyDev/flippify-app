import Stripe from 'stripe';


const createCheckoutSession = async (username: string, customerId: string, priceId: string) => {
    const stripeAPIKey = process.env.STRIPE_SECRET_KEY as string;
    const root = "https://flippify.co.uk"
    const local = "http://localhost:3000"

    if (!stripeAPIKey) {
        throw new Error('Stripe api key not found');
    }
    
    const stripe = new Stripe(stripeAPIKey);

    try {
        const successUrl = `${root}/u/${username}/dashboard`;
        const cancelUrl = `${root}/u/${username}/plans`;

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
        })

    return checkoutSession.url
    } catch (error) {
        console.error('Error retrieving customer:', error);
        throw error;
    }
};

export default createCheckoutSession