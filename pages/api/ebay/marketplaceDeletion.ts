import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Get the incoming notification data
    const notification = req.body;

    // Example verification token from your environment
    const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;

    // Verify that the notification is valid using the token
    if (notification.verification_token !== verificationToken) {
      return res.status(401).json({ error: 'Invalid verification token' });
    }

    // Log the event or take action based on the event type
    if (notification.event === 'MARKETPLACE_ACCOUNT_DELETION') {
      // Perform actions such as removing the user's data from your database
      console.log('eBay account deleted:', notification.userId);

      // Example: Remove user from your database or mark their account as deleted
      // await User.delete({ ebayUserId: notification.userId });

      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Unknown event type' });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
