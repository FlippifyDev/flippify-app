import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../auth-mongodb/dbConnect';
import { getSession } from 'next-auth/react';
import { User } from 'app/api/auth-mongodb/userModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || Array.isArray(code)) {
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
  const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    return res.status(500).json({ error: 'Missing eBay credentials' });
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.sandbox.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Retrieve session
    const session = await getSession({ req });

    if (!session || !session.user?.discordId) {
      return res.status(401).json({ error: 'User not authenticated or Discord ID not found' });
    }

    const discordId = session.user.discordId;

    // Connect to MongoDB
    await connectDB();
    const user = await User.findOne({ discord_id: discordId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Store tokens in MongoDB
    user.ebayAccessToken = tokenData.access_token;
    user.ebayRefreshToken = tokenData.refresh_token;
    user.ebayTokenExpiry = Date.now() + tokenData.expires_in * 1000;

    await user.save();  // Save updated user info

    // Redirect to the profile page after connecting
    res.redirect('/profile?ebayConnected=true');
  } catch (error) {
    console.error('Error during eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
