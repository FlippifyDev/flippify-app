import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/app/api/auth-mongodb/dbConnect'; // Correct path to DB connection
import { getSession } from 'next-auth/react';
import { User } from '@/app/api/auth-mongodb/userModel'; // Adjust the path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  // Log to confirm callback is hit
  console.log("eBay OAuth Callback Invoked. Code:", code);

  if (!code || Array.isArray(code)) {
    console.error("Authorization code is missing or invalid.");
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
  const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

  if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    console.error('Missing eBay credentials');
    return res.status(500).json({ error: 'Missing eBay credentials' });
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://api.sandbox.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    });

    const tokenData = await tokenResponse.json();

    // Log token response
    console.log("Token Data:", tokenData);

    if (tokenData.error) {
      console.error("Error during token exchange:", tokenData.error_description);
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Retrieve user session
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

    // Store tokens in MongoDB under the "ebay" object
    user.ebay = {
      ebayAccessToken: tokenData.access_token,
      ebayRefreshToken: tokenData.refresh_token,
      ebayTokenExpiry: Date.now() + tokenData.expires_in * 1000
    };

    await user.save();

    console.log("User tokens successfully stored in MongoDB:", {
      ebayAccessToken: user.ebay.ebayAccessToken,
      ebayRefreshToken: user.ebay.ebayRefreshToken,
      ebayTokenExpiry: user.ebay.ebayTokenExpiry,
    });

    // Redirect to a confirmation page or home
    res.redirect('/?ebayConnected=true');
  } catch (error) {
    console.error('Error during eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
