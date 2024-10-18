import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { refreshEbayToken } from '@/app/api/ebay/refreshEbayToken';  // Correct path to refresh token function
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user?.customerId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { customerId, ebay } = session.user;  // Using stripe_customer_id

  // Check if the ebay section exists and has the required properties
  const ebayAccessToken = ebay?.ebayAccessToken;
  const ebayTokenExpiry = ebay?.ebayTokenExpiry;

  if (!ebayAccessToken || !ebayTokenExpiry) {
    return res.status(400).json({ error: 'eBay tokens not found' });
  }

  // Check if the token is expired and refresh it
  if (Date.now() >= ebayTokenExpiry) {
    console.log("eBay token expired. Refreshing...");
    await refreshEbayToken(customerId);  // Refresh token using customer ID
  }

  try {
    const url = 'https://api.ebay.com/sell/fulfillment/v1/order?limit=10';  // Fetch up to 10 orders

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching eBay orders');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching eBay orders:', error);
    res.status(500).json({ error: 'Error fetching eBay orders' });
  }
}
