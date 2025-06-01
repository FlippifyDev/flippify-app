// External Imports
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

// Local Imports
import { createEbayToken } from '@/services/oauth/ebay/create-token';
import { addToken } from '@/services/oauth/add-token';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query;

    if (!code || Array.isArray(code)) {
        return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
    }

    try {
        // Create the users tokens
        const tokenData = await createEbayToken(code);
        if (tokenData.error || !tokenData.access_token) {
            return res.status(400).json({ error: `${tokenData.error_description} No Token Data found. Code: ${code}` });
        }

        // Fetch the users session data
        const session = await getSession({ req });
        if (!session || !session.user?.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Add the new tokens to the users doc in the database
        const tokenAdditionResponse = await addToken({ store: "stockx", tokenData, uid: session.user.id as string });
        if (tokenAdditionResponse && tokenAdditionResponse.error) {
            return res.status(404).json({ error: tokenAdditionResponse.error });
        }

        // Redirect to the connecting ebay page
        res.redirect(`/u/${session.user.username}/profile`)
    } catch (error) {
        console.error('Error during eBay OAuth callback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
