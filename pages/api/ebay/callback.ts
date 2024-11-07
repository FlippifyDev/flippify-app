// External Imports
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

// Local Imports
import { IEbayTokenData } from '@/models/ebay-api-models';
import { createEbayToken } from '@/app/api/ebay/token-handlers';
import { addEbayTokens } from '@/app/api/ebay/token-handlers';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || Array.isArray(code)) {
    return res.status(400).json({ error: 'Authorization code is missing or invalid.' });
  }

  try {
    // Create the users tokens
    const tokenData: IEbayTokenData = await createEbayToken(code)
    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error_description });
    }

    // Fetch the users session data
    const session = await getSession({ req });
    if (!session || !session.user?.customerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Add the new tokens to the users doc in the database
    const tokenAdditionResponse = await addEbayTokens(tokenData, session);
    if (tokenAdditionResponse.error) {
        return res.status(404).json({ "Error": tokenAdditionResponse.error });
    }

    // Redirect to the connecting ebay page
    res.redirect(`/u/${session.user.username}/profile`) //res.redirect(`/u/${session.user.username}/profile/connecting-ebay`); 
  } catch (error) {
    console.error('Error during eBay OAuth callback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
