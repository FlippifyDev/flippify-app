import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN; // Load the verification token from env

  // Handle GET request from eBay to validate the endpoint
  if (req.method === 'GET') {
    // eBay sends a challenge_code for validation
    const challengeCode = req.query.challenge_code as string;

    if (!challengeCode) {
      return res.status(400).json({ error: 'No challenge code provided' });
    }

    // The endpoint URL you provided to eBay
    const endpoint = 'https://flippify.co.uk/api/ebay/marketplaceDeletion';

    // Generate the SHA-256 hash using the challengeCode + verificationToken + endpoint
    const hash = crypto.createHash('sha256');
    hash.update(challengeCode + verificationToken + endpoint);
    const challengeResponse = hash.digest('hex');

    // Respond to eBay with the challengeResponse to validate the endpoint
    return res.status(200).json({ challengeResponse });
  }

  // Handle POST request from eBay for actual event notifications
  if (req.method === 'POST') {
    // Get the incoming notification data
    const notification = req.body;

    // Verify that the notification contains a valid token
    if (notification.verification_token !== verificationToken) {
      return res.status(401).json({ error: 'Invalid verification token' });
    }

    // Handle Marketplace Account Deletion event
    if (notification.event === 'MARKETPLACE_ACCOUNT_DELETION') {
      console.log('eBay account deleted:', notification.userId);

      // Perform actions, such as deleting the user data from your database
      // Example: await User.delete({ ebayUserId: notification.userId });

      return res.status(200).json({ success: true });
    }

    // If the event type is unknown
    return res.status(400).json({ error: 'Unknown event type' });
  }

  // Method not allowed for other request types
  return res.status(405).json({ error: 'Method Not Allowed' });
}
