import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || Array.isArray(code)) {
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  // Get environment variables
  const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
  const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

  // Check if environment variables are set
  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.error('Missing environment variables', {
      CLIENT_ID,
      CLIENT_SECRET,
      REDIRECT_URI,
    });
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  // Ensure variables are treated as strings (since we verified they are not undefined)
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.sandbox.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI as string)}`,
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Retrieve session
    const session = await getSession({ req });

    if (!session || !session.user?.discordId) {
      return res.status(401).json({ error: 'User not authenticated or Discord ID not found' });
    }

    const discordId = session.user.discordId;

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('flippifyDB');
    const usersCollection = db.collection('users');

    // Query for the user's stripe_customer_id using discord_id
    const user = await usersCollection.findOne({ discord_id: discordId });
    if (!user || !user.stripe_customer_id) {
      return res.status(404).json({ error: 'Stripe Customer ID not found for user' });
    }

    const stripeCustomerId = user.stripe_customer_id;

    // Store tokens in MongoDB
    await usersCollection.updateOne(
      { discord_id: discordId },
      {
        $set: {
          ebayAccessToken: tokenData.access_token,
          ebayRefreshToken: tokenData.refresh_token,
          ebayTokenExpiry: Date.now() + tokenData.expires_in * 1000,
        },
      },
      { upsert: true }
    );

    client.close();

    // Redirect to user profile or another page after connection
    res.redirect('/profile?ebayConnected=true');
  } catch (error) {
    console.error('Error handling eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
