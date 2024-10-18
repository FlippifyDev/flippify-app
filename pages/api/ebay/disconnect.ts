import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/app/api/auth-mongodb/dbConnect';  // Adjust path if necessary
import { getSession } from 'next-auth/react';
import { User } from '@/app/api/auth-mongodb/userModel';  // Adjust path if necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });

    if (!session || !session.user?.discordId) {
      return res.status(401).json({ error: 'User not authenticated or Discord ID not found' });
    }

    const discordId = session.user.discordId;

    await connectDB();

    const user = await User.findOne({ discord_id: discordId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Disconnect the eBay account
    user.ebay = {
      ebayAccessToken: null,
      ebayRefreshToken: null,
      ebayTokenExpiry: null,
    };

    await user.save();  // Save updated user info


    return res.status(200).json({ message: 'eBay account disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting eBay account:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
