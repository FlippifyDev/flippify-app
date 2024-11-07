// External Imports
import fetch from 'node-fetch';
import { Session } from 'next-auth';

// Local Imports
import { IEbayTokenData } from '@/models/ebay-api-models';
import { User } from '@/app/api/auth-mongodb/userModel'; 



async function refreshEbayToken(customerId: string) {
  try {
    const user = await User.findOne({ stripe_customer_id: customerId });

    if (!user || !user.ebay?.ebayRefreshToken) {
      throw new Error('User or eBay refresh token not found');
    }

    const refreshToken = user.ebay.ebayRefreshToken;
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;

    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    const tokenData = await tokenResponse.json() as IEbayTokenData;

    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Error refreshing eBay token');
    }

    user.ebay.ebayAccessToken = tokenData.access_token;
    user.ebay.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000;
    user.ebay.ebayRefreshToken = tokenData.refresh_token || refreshToken;

    await user.save();

    return tokenData.access_token;
  } catch (error) {
    console.error('Error refreshing eBay token:', error);
    throw error;
  }
}


async function createEbayToken(code: string): Promise<IEbayTokenData> {
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        return {
            access_token: "",
            refresh_token: "",
            expires_in: 0,
            error: "Missing client credentials.",
            error_description: "Could not find clients credentials."
        }
    }

    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    });

    return await tokenResponse.json() as IEbayTokenData;
}


async function addEbayTokens(tokenData: IEbayTokenData, session: Session) {
  const customerId = session.user.customerId;
  const user = await User.findOne({ stripe_customer_id: customerId });

  if (!user) {
    return { error: 'User not found' };
  }

  if (!user.ebay) {
    // Initialize eBay object if it doesn't exist
    user.ebay = {};  
  }

  user.ebay.ebayAccessToken = tokenData.access_token;
  user.ebay.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000;
  user.ebay.ebayRefreshToken = tokenData.refresh_token;

  await user.save();

  return { error: null }
}



export { createEbayToken, refreshEbayToken, addEbayTokens}