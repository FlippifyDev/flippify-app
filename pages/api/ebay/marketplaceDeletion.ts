import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

  // Handle GET request for challenge validation
  if (req.method === 'GET') {
    const challengeCode = req.query.challenge_code as string;

    if (!challengeCode) {
      return res.status(400).json({ error: 'No challenge code provided' });
    }

    const endpoint = 'https://flippify.co.uk/api/ebay/marketplaceDeletion';

    const hash = crypto.createHash('sha256');
    hash.update(challengeCode + verificationToken + endpoint);
    const challengeResponse = hash.digest('hex');

    return res.status(200).json({ challengeResponse });
  }

  // Handle POST request for notifications
  if (req.method === 'POST') {
    const notification = req.body;

    // Validate the verification token in the request
    if (notification.verification_token !== verificationToken) {
      // This is the key part - if tokens don't match, respond with 401 Unauthorized
      return res.status(401).json({ error: 'Invalid verification token' });
    }

    if (notification.event === 'MARKETPLACE_ACCOUNT_DELETION') {
      console.log('eBay account deleted:', notification.userId);
      // Perform actions for account deletion, e.g., remove user data
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown event type' });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
