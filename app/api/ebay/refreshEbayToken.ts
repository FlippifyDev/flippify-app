import { User } from '@/app/api/auth-mongodb/userModel'; 
import fetch from 'node-fetch';
import { getEnvVar } from './getEnvVar';

interface EbayTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

export async function refreshEbayToken(customerId: string) {
  try {
    const user = await User.findOne({ stripe_customer_id: customerId });

    if (!user || !user.ebay?.ebayRefreshToken) {
      throw new Error('User or eBay refresh token not found');
    }

    const refreshToken = user.ebay.ebayRefreshToken;
    const CLIENT_ID = getEnvVar('NEXT_PUBLIC_EBAY_CLIENT_ID');
    const CLIENT_SECRET = getEnvVar('EBAY_CLIENT_SECRET');

    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });

    const tokenData = await tokenResponse.json() as EbayTokenData;

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
