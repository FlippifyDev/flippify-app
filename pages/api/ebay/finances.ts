import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { User } from '@/app/api/auth-mongodb/userModel';
import { refreshEbayToken } from '@/app/api/ebay/refreshEbayToken';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure MongoDB is connected
    await connectDB();
    
    // Get session from next-auth
    const session = await getSession({ req });
    if (!session || !session.user?.customerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const customerId = session.user.customerId;

    // Fetch user from the database using stripeCustomerId
    const user = await User.findOne({ stripe_customer_id: customerId });
    if (!user || !user.ebay || !user.ebay.ebayAccessToken || !user.ebay.ebayTokenExpiry) {
      return res.status(400).json({ error: 'eBay tokens not found for this user' });
    }

    let { ebayAccessToken, ebayTokenExpiry } = user.ebay;

    // Check if the token is expired and refresh it if necessary
    if (Date.now() >= ebayTokenExpiry) {
      await refreshEbayToken(customerId);  // This refreshes the token in MongoDB
      const refreshedUser = await User.findOne({ stripe_customer_id: customerId });
      ebayAccessToken = refreshedUser?.ebay?.ebayAccessToken || '';
    }

    if (!ebayAccessToken) {
      return res.status(400).json({ error: 'Unable to retrieve a valid eBay Access Token' });
    }

    // Make the request to eBay's Finance API
    const financeResponse = await fetch('https://api.ebay.com/sell/finances/v1/transaction?limit=10', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ebayAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!financeResponse.ok) {
      const errorResponse: unknown = await financeResponse.json();
    
      // Use a type guard to check if errorResponse is an object with a message
      const errorMessage =
        typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
          ? (errorResponse as { message: string }).message
          : 'Failed to fetch financial data from eBay.';

      console.error("Error response from eBay Finances API:", errorMessage);
      return res.status(financeResponse.status).json({
        error: errorMessage,
      });
    }

    // Parse and return the data
    const financeData = await financeResponse.json();
    return res.status(200).json(financeData);

  } catch (error: unknown) {
    // General error handling with improved logging
    if (error instanceof Error) {
      console.error('Error fetching financial data:', error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error('Unknown error occurred while fetching financial data');
      return res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
}
