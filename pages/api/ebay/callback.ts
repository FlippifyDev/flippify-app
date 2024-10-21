import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { getSession } from 'next-auth/react';
import { User } from '@/app/api/auth-mongodb/userModel';
import fetch from 'node-fetch';

// Define the EbayTokenData interface
interface EbayTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || Array.isArray(code)) {
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
  const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    return res.status(500).json({ error: 'Missing eBay credentials' });
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    });

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json() as EbayTokenData;

      const session = await getSession({ req });

      if (!session || !session.user?.customerId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const customerId = session.user.customerId;

      await connectDB();
      const user = await User.findOne({ stripe_customer_id: customerId });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.ebay) {
        user.ebay = {};  // Initialize eBay object if it doesn't exist
      }

      user.ebay.ebayAccessToken = tokenData.access_token;
      user.ebay.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000;
      user.ebay.ebayRefreshToken = tokenData.refresh_token;

      await user.save();

      // Redirect to profile with success status
      return res.redirect('/profile?ebayConnected=true');
    } else {
      const errorDetails = await tokenResponse.text();
      console.error("Error exchanging authorization code:", errorDetails);
      return res.status(tokenResponse.status).json({ error: errorDetails });
    }
  } catch (error) {
    console.error('Error during eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
