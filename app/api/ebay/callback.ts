// pages/api/ebay/callback.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { getSession } from 'next-auth/react';
import { getEnvVar } from '@/app/api/ebay/getEnvVar';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("eBay OAuth Callback Handler Invoked");
  
  // Extract the authorization code from the query string
  const { code } = req.query;
  
  if (!code || Array.isArray(code)) {
    console.error("Authorization code is missing or invalid:", code);
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  console.log("Authorization Code:", code);

  const CLIENT_ID = getEnvVar('EBAY_CLIENT_ID');
  const CLIENT_SECRET = getEnvVar('EBAY_CLIENT_SECRET');
  const REDIRECT_URI = getEnvVar('EBAY_REDIRECT_URI');

  console.log("Using Environment Variables:");
  console.log("CLIENT_ID:", CLIENT_ID);
  console.log("REDIRECT_URI:", REDIRECT_URI);

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

    if (tokenData.error) {
      console.error("Error during token exchange:", tokenData.error_description);
      return res.status(400).json({ error: tokenData.error_description });
    }

    console.log("Token Data:", tokenData);

    const session = await getSession({ req });

    if (!session || !session.user?.discordId) {
      console.error("User session not found or Discord ID missing.");
      return res.status(401).json({ error: 'User not authenticated or Discord ID not found' });
    }

    const discordId = session.user.discordId;

    console.log("Discord ID:", discordId);

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

    console.log("User eBay tokens stored successfully.");

    // Redirect to a profile or dashboard page after successful connection
    res.redirect('/profile?ebayConnected=true');
  } catch (error) {
    console.error('Error handling eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
