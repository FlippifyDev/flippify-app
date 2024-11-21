import Stripe from 'stripe';

// Initialize Stripe client with your secret key (use environment variables)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default stripe;