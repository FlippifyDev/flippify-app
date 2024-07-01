import Stripe from 'stripe';


const createCheckoutSession = async (username: string, customerId: string, productId: string) => {
    const stripeAPIKey = process.env.STRIPE_SECRET_KEY as string;

    if (!stripeAPIKey) {
        throw new Error('Stripe api key not found');
    }
    
    const stripe = new Stripe(stripeAPIKey);

    try {
        const successUrl = `http://localhost:3000/u/${username}/plans`;
        const cancelUrl = `http://localhost:3000/u/${username}/plans`;

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: productId,
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