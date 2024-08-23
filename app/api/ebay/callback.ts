// pages/api/ebay/callback.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { getSession } from 'next-auth/react';
import { getEnvVar } from '@/app/api/ebay/getEnvVar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Extract the authorization code from the query string
  const { code } = req.query;

  // Ensure the code is present
  if (!code || Array.isArray(code)) {
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  // Retrieve environment variables
  const CLIENT_ID = getEnvVar('EBAY_CLIENT_ID');
  const CLIENT_SECRET = getEnvVar('EBAY_CLIENT_SECRET');
  const REDIRECT_URI = getEnvVar('EBAY_REDIRECT_URI');

  // Prepare the Basic Auth header
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch('https://api.sandbox.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    });

    const tokenData = await tokenResponse.json();

    // Handle any errors from the token exchange
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Get the user session (assuming you use NextAuth for authentication)
    const session = await getSession({ req });

    if (!session || !session.user?.discordId) {
      return res.status(401).json({ error: 'User not authenticated or Discord ID not found' });
    }

    const discordId = session.user.discordId;

    // Store the access token and other details in MongoDB
    const client = await MongoClient.connect(getEnvVar('MONGODB_URI'));
    const db = client.db('your-db-name');
    const collection = db.collection('users');

    await collection.updateOne(
      { discordID: discordId },
      {
        $set: {
          ebayAccessToken: tokenData.access_token,
          ebayRefreshToken: tokenData.refresh_token,
          ebayTokenExpiry: Date.now() + tokenData.expires_in * 1000,
        },
      }
    );

    client.close();

    // Redirect to a profile or dashboard page after successful connection
    res.redirect('/profile?ebayConnected=true');
  } catch (error) {
    console.error('Error handling eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
