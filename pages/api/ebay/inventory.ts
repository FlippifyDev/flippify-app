import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { User } from '@/app/api/auth-mongodb/userModel';
import { refreshEbayToken } from '@/app/api/ebay/token-handlers';
import fetch from 'node-fetch';

interface EbayError {
  message?: string;
  error?: string;
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    const session = await getSession({ req });

    if (!session || !session.user?.customerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const customerId = session.user.customerId;
    const user = await User.findOne({ stripe_customer_id: customerId });

    // Check if user has valid eBay tokens
    if (!user || !user.ebay || !user.ebay.ebayAccessToken || !user.ebay.ebayTokenExpiry) {
      return res.status(400).json({ error: 'eBay tokens not found' });
    }

    let { ebayAccessToken, ebayTokenExpiry } = user.ebay;

    // Refresh the token if it's expired
    if (Date.now() >= ebayTokenExpiry) {
      ebayAccessToken = await refreshEbayToken(customerId);
      if (!ebayAccessToken) {
        return res.status(400).json({ error: 'Failed to refresh eBay Access Token' });
      }
    }

    const date = new Date().toISOString().split('T')[0];
    // Now, fetch the user's inventory items
    const inventoryUrl = `${process.env.EBAY_FEED_API_URL}&date=${date}`;
    const inventoryResponse = await fetch(inventoryUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    

    if (!inventoryResponse.ok) {
      const errorResponse = await inventoryResponse.json() as EbayError;
      console.error('Error fetching inventory:', errorResponse);
      const errorMessage = errorResponse.message || errorResponse.error || 'Failed to fetch inventory data';
      return res.status(500).json({ error: errorMessage });
    }

    // Successfully fetched inventory data
    const inventoryData = await inventoryResponse.json();
    console.log("inventory data", inventoryData)
    return res.status(200).json(inventoryData);

  } catch (error: any) {
    console.error('Error fetching eBay inventory:', error.message || 'Unknown error');
    return res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
}
