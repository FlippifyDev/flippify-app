import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const root = process.env.ROOT as string;
  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
  const endpoint = root.concat('/api/ebay/marketplaceDeletion'); // Replace with your endpoint
  
  if (req.method === 'GET') {
    // Handle the initial verification GET request from eBay
    const challengeCode = req.query.challenge_code as string;

    if (!challengeCode) {
      return res.status(400).json({ error: 'No challenge code provided' });
    }

    // Generate the SHA-256 hash (challengeCode + verificationToken + endpoint)
    const hash = crypto.createHash('sha256');
    hash.update(challengeCode + verificationToken + endpoint);
    const challengeResponse = hash.digest('hex');

    // Send the challengeResponse back to eBay
    return res.status(200).json({ challengeResponse });
  }

  if (req.method === 'POST') {
    // Handle actual notifications sent by eBay
    const notification = req.body;

    // Verify the notification using the verification token
    if (notification.verification_token !== verificationToken) {
      return res.status(401).json({ error: 'Invalid verification token' });
    }

    if (notification.event === 'MARKETPLACE_ACCOUNT_DELETION') {
      // Perform any necessary cleanup, such as deleting the user's data
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown event type' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
