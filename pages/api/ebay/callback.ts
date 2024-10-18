import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { getSession } from 'next-auth/react';
import { User } from 'app/api/auth-mongodb/userModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  console.log("OAuth Callback Invoked with Code:", code);

  if (!code || Array.isArray(code)) {
    console.error("Authorization code is missing or invalid.");
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
  const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

  console.log("Client ID:", CLIENT_ID);
  console.log("Client Secret:", CLIENT_SECRET ? "Present" : "Not Set");
  console.log("Redirect URI:", REDIRECT_URI);

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.error('Missing eBay credentials');
    return res.status(500).json({ error: 'Missing eBay credentials' });
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    // Request tokens from eBay
    const tokenResponse = await fetch('https://api.sandbox.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    });

    const tokenData = await tokenResponse.json();

    // Log the returned tokens
    console.log("Token Data Returned from eBay:", tokenData);

    if (tokenData.error) {
      console.error("Error during token exchange:", tokenData.error_description);
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Retrieve session
    const session = await getSession({ req });

    if (!session || !session.user?.discordId) {
      console.error("User session not found or Discord ID missing.");
      return res.status(401).json({ error: 'User not authenticated or Discord ID not found' });
    }

    const discordId = session.user.discordId;

    // Connect to MongoDB
    await connectDB();
    const user = await User.findOne({ discord_id: discordId });

    if (!user) {
      console.error("User not found in MongoDB for Discord ID:", discordId);
      return res.status(404).json({ error: 'User not found' });
    }

    // Log the current state of the user object
    console.log("User before token update:", user);

    // Store tokens in MongoDB
    user.ebayAccessToken = tokenData.access_token;
    user.ebayRefreshToken = tokenData.refresh_token;
    user.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000;

    console.log("Updated User with eBay Tokens:", {
      ebayAccessToken: user.ebayAccessToken,
      ebayRefreshToken: user.ebayRefreshToken,
      ebayTokenExpiry: user.ebayTokenExpiry,
    });

    // Save updated user info to MongoDB
    await user.save();

    // Log confirmation of saving
    console.log("User tokens successfully stored in MongoDB");

    // Redirect to the profile page after connecting
    res.redirect('/profile?ebayConnected=true');
  } catch (error) {
    console.error('Error during eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
