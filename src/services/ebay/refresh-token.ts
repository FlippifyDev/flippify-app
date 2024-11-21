"use server"

import connectToMongoDB from '@/src/lib/mongo/client';
import { User } from '@/src/models/mongodb/users';
import { IEbayTokenData } from '@/src/models/firebase';


async function refreshEbayToken(customerId: string): Promise<string> {
  try {
    // Ensure database connection
    await connectToMongoDB();

    // Retrieve the user from the database
    const user = await User.findOne({ stripe_customer_id: customerId });

    if (!user || !user.ebay?.ebayRefreshToken) {
    	throw new Error('User or eBay refresh token not found');
    }

    const refreshToken = user.ebay.ebayRefreshToken;
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;

    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    // Make the request to eBay to refresh the token
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    // Check if the response is successful
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(errorData.error_description || 'Error refreshing eBay token');
    }

    // Parse the token data
    const tokenData = await tokenResponse.json() as IEbayTokenData;

    // If there was an error from eBay, throw an error
    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Error refreshing eBay token');
    }

    // Update the user's eBay tokens in MongoDB
    user.ebay.ebayAccessToken = tokenData.access_token;
    user.ebay.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000;
    user.ebay.ebayRefreshToken = tokenData.refresh_token || refreshToken;

    await user.save();

    // Return the new access token
    return tokenData.access_token;

  } catch (error) {
    console.error('Error refreshing eBay token:', error);
    throw error; // Rethrow error to handle it further up the call stack if necessary
  }
}

export { refreshEbayToken };
