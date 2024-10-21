import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { User } from '@/app/api/auth-mongodb/userModel';
import { refreshEbayToken } from '@/app/api/ebay/refreshEbayToken'; 
import fetch from 'node-fetch';

interface EbayError {
  message?: string;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();  // Ensure MongoDB is connected
    const session = await getSession({ req });

    if (!session || !session.user?.customerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const customerId = session.user.customerId;

    const user = await User.findOne({ stripe_customer_id: customerId });

    if (!user || !user.ebay || !user.ebay.ebayAccessToken || !user.ebay.ebayTokenExpiry) {
      return res.status(400).json({ error: 'eBay tokens not found' });
    }

    let { ebayAccessToken, ebayTokenExpiry } = user.ebay;

    if (Date.now() >= ebayTokenExpiry) {
      console.log("eBay token expired. Refreshing...");
      await refreshEbayToken(customerId);
      const refreshedUser = await User.findOne({ stripe_customer_id: customerId });
      ebayAccessToken = refreshedUser?.ebay?.ebayAccessToken ?? '';
    }

    if (!ebayAccessToken) {
      return res.status(400).json({ error: 'Unable to fetch eBay Access Token' });
    }

    const response = await fetch('https://api.ebay.com/sell/fulfillment/v1/order?limit=10', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json() as EbayError;
      const errorMessage = errorResponse.message || errorResponse.error || 'Failed to fetch orders data';
      return res.status(500).json({ error: errorMessage });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching eBay orders:', error.message || 'Unknown error');
    return res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
}
