import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || !session.user?.discordId) {
    return res.status(401).json({ error: 'User not authenticated or Discord ID not found' });
  }

  const discordId = session.user.discordId;

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('flippifyDB');
    const usersCollection = db.collection('users');

    // Remove eBay tokens from MongoDB
    await usersCollection.updateOne(
      { discord_id: discordId },
      { $unset: { ebayAccessToken: "", ebayRefreshToken: "", ebayTokenExpiry: "" } }
    );

    client.close();

    res.status(200).json({ message: 'eBay account disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting eBay account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
