import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { refreshEbayToken } from '@/app/api/ebay/refreshEbayToken';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user?.customerId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { customerId, ebay } = session.user;

  const ebayAccessToken = ebay?.ebayAccessToken;
  const ebayTokenExpiry = ebay?.ebayTokenExpiry;

  if (!ebayAccessToken || !ebayTokenExpiry) {
    return res.status(400).json({ error: 'eBay tokens not found' });
  }

  if (Date.now() >= ebayTokenExpiry) {
    console.log("eBay token expired. Refreshing...");
    await refreshEbayToken(customerId);  // Refresh token using customer ID
  }

  try {
    const url = 'https://api.ebay.com/sell/finances/v1/transaction?limit=10';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching financial data');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching eBay finances:', error);
    res.status(500).json({ error: 'Error fetching eBay finances' });
  }
}
