// Define the interface for the token data expected from the eBay API
interface EbayTokenData {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    error?: string;
    error_description?: string;
  }
  
  import fetch from 'node-fetch';
  import { User } from '@/app/api/auth-mongodb/userModel';
  
  export async function refreshEbayToken(userId: string) {
    try {
      const user = await User.findById(userId);
  
      if (!user || !user.ebay || !user.ebay.ebayRefreshToken) {
        throw new Error('User or eBay refresh token not found');
      }
  
      const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
      const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
  
      const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
      const tokenResponse = await fetch('https://api.sandbox.ebay.com/identity/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${user.ebay.ebayRefreshToken}`,
      });
  
      const tokenData = (await tokenResponse.json()) as EbayTokenData;
  
      if (tokenData.error) {
        throw new Error(tokenData.error_description);
      }
  
      // Update user with new tokens
      user.ebay.ebayAccessToken = tokenData.access_token;
      user.ebay.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000;
  
      await user.save();
      console.log("Tokens successfully refreshed for user:", userId);
    } catch (error) {
      console.error("Error refreshing eBay token:", error);
    }
  }
  