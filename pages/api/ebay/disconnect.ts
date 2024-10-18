import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/app/api/auth-mongodb/dbConnect';
import { getSession } from 'next-auth/react';
import { User } from 'app/api/auth-mongodb/userModel';

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

    // Remove the eBay tokens from the user object
    user.ebayAccessToken = undefined;
    user.ebayRefreshToken = undefined;
    user.ebayTokenExpiry = undefined;

    await user.save();  // Save updated user info

    return res.status(200).json({ message: 'eBay account disconnected successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
