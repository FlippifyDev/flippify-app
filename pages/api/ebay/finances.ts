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

  if (!ebay || !ebay.ebayAccessToken || !ebay.ebayTokenExpiry) {
    return res.status(400).json({ error: 'eBay tokens not found' });
  }

  if (Date.now() >= ebay.ebayTokenExpiry) {
    await refreshEbayToken(customerId);
  }

  const refreshedSession = await getSession({ req });
  const ebayAccessToken = refreshedSession?.user?.ebay?.ebayAccessToken;

  try {
    const url = 'https://api.ebay.com/sell/finances/v1/transaction?limit=10';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch eBay financial data' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
