import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { User } from '@/app/api/auth-mongodb/userModel';
import { refreshEbayToken } from '@/app/api/ebay/refreshEbayToken'; 
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();  // Ensure MongoDB is connected
    const session = await getSession({ req });

    if (!session || !session.user?.customerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const customerId = session.user.customerId;

    // Fetch user from the database using stripeCustomerId
    const user = await User.findOne({ stripe_customer_id: customerId });

    if (!user || !user.ebay || !user.ebay.ebayAccessToken || !user.ebay.ebayTokenExpiry) {
      return res.status(400).json({ error: 'eBay tokens not found' });
    }

    let { ebayAccessToken, ebayTokenExpiry } = user.ebay;

    // Check if the token is expired and refresh it
    if (Date.now() >= ebayTokenExpiry) {
      console.log("eBay token expired. Refreshing...");
      await refreshEbayToken(customerId);  // This will refresh the eBay token in MongoDB
      const refreshedUser = await User.findOne({ stripe_customer_id: customerId });
      ebayAccessToken = refreshedUser?.ebay?.ebayAccessToken ?? '';  // Set default to an empty string
    }

    if (!ebayAccessToken) {
      return res.status(400).json({ error: 'Unable to fetch eBay Access Token' });
    }

    // Now proceed to make your eBay API request using the new or existing eBay access token
    const response = await fetch('https://api.ebay.com/sell/finances/v1/transaction?limit=10', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return res.status(500).json({ error: errorResponse?.message || 'Failed to fetch financial data' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching eBay finances:', error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error('Unknown error occurred');
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
