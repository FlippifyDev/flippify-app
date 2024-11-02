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
    // Ensure MongoDB is connected
    await connectDB();  

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

    // Check if user has valid eBay tokens
    if (Date.now() >= ebayTokenExpiry) {
      ebayAccessToken = await refreshEbayToken(customerId);
      
      // Handle case where token still isn't available
      if (!ebayAccessToken) {
        return res.status(400).json({ error: 'Failed to refresh eBay Access Token' });
      }
    }

    const ebay_inventory_api_url = process.env.EBAY_INVENTORY_API_URL;
    if (!ebay_inventory_api_url) {
      return res.status(400).json({ error: 'Failed to find ebay inventory api' });
    }

    const response = await fetch(ebay_inventory_api_url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      const errorResponse = await response.json() as EbayError;
      console.error('Error fetching inventory:', errorResponse);
      const errorMessage = errorResponse.message || errorResponse.error || 'Failed to fetch inventory data';
      return res.status(500).json({ error: errorMessage });
    }

    // Successfully fetched inventory data
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error: any) {
    console.error('Error fetching eBay inventory:', error.message || 'Unknown error');
    return res.status(500).json({ error: error.message || 'Unknown error occurred' });
  }
}
