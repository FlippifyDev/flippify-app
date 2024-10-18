import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { refreshEbayToken } from '@/app/api/ebay/refreshEbayToken';  // Correct path to refresh token function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user?.customerId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  const { customerId, ebay } = session.user;  // Use Stripe customer ID

  // Check if the ebay section exists and has the required properties
  const ebayAccessToken = ebay?.ebayAccessToken;
  const ebayTokenExpiry = ebay?.ebayTokenExpiry;

  if (!ebayAccessToken || !ebayTokenExpiry) {
    return res.status(400).json({ error: 'eBay tokens not found' });
  }

  // Check if the token is expired and refresh it
  if (Date.now() >= ebayTokenExpiry) {
    console.log("eBay token expired. Refreshing...");
    await refreshEbayToken(customerId);  // This will refresh the eBay token using Stripe customer ID
  }

  // Fetch updated session with refreshed tokens
  const refreshedSession = await getSession({ req });

  const newEbayAccessToken = refreshedSession?.user?.ebay?.ebayAccessToken;

  if (!newEbayAccessToken) {
    return res.status(400).json({ error: 'Unable to fetch eBay Access Token' });
  }

  // Now proceed to make your eBay API request using the new or existing eBay access token
  try {
    const response = await fetch('https://api.ebay.com/sell/inventory/v1/inventory_item', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${newEbayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json(data); // Return eBay inventory data to the client
    } else {
      res.status(500).json({ error: `Failed to fetch eBay inventory: ${data.errorMessage}` });
    }
  } catch (error) {
    console.error('Error fetching eBay inventory:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
