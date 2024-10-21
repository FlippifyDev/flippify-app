import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { User } from '@/app/api/auth-mongodb/userModel';
import { refreshEbayToken } from '@/app/api/ebay/refreshEbayToken'; 
import fetch from 'node-fetch';

// Define an interface for the expected response structure
interface EbayFinancialData {
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    type: string;
    status: string;
  }>;
  message?: string;  // Optional in case of errors
}

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
      await refreshEbayToken(customerId);
      const refreshedUser = await User.findOne({ stripe_customer_id: customerId });
      ebayAccessToken = refreshedUser?.ebay?.ebayAccessToken ?? '';
    }

    if (!ebayAccessToken) {
      return res.status(400).json({ error: 'Unable to fetch eBay Access Token' });
    }

    console.log(`Making request to eBay with token: ${ebayAccessToken}`);

    // Make the API request to eBay for financial data
    const response = await fetch('https://api.ebay.com/sell/finances/v1/transaction?limit=10', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json() as EbayFinancialData;

    if (!response.ok) {
      console.log(`eBay API returned an error: ${response.status} ${JSON.stringify(responseData)}`);
      return res.status(500).json({ error: responseData.message || 'Failed to fetch financial data' });
    }

    return res.status(200).json(responseData);
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
