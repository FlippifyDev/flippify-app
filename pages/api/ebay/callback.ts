// External Imports
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

// Local Imports
import { createEbayToken } from '@/services/ebay/create-token';
import { addEbayTokens } from '@/services/ebay/add-token';
import { IEbay } from '@/models/user';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { code } = req.query;

	if (!code || Array.isArray(code)) {
		return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
	}

	try {
		// Create the users tokens
        const tokenData: IEbay = await createEbayToken(code);
        console.log("TokenData", tokenData);
		if (tokenData.error) {
			return res.status(400).json({ error: tokenData.error_description });
		}

		// Fetch the users session data
		const session = await getSession({ req });
        console.log("Session", session);
		if (!session || !session.user?.id) {
			return res.status(401).json({ error: 'User not authenticated' });
		}

		// Add the new tokens to the users doc in the database
		const tokenAdditionResponse = await addEbayTokens(tokenData, session);
        console.log("TokenAdditionResponse", tokenAdditionResponse);
        if (tokenAdditionResponse && tokenAdditionResponse.error) {
			return res.status(404).json({ "Error": tokenAdditionResponse.error });
		}

		// Redirect to the connecting ebay page
		res.redirect(`/u/${session.user.username}/profile`) 
	} catch (error) {
		console.error('Error during eBay OAuth callback:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
