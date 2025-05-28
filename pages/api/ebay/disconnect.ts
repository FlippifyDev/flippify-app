// Local Imports

// External Imports
import { retrieveUserRefAdmin } from '@/services/firebase/admin-retrieve';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nookies from 'nookies';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });

        if (!session || !session.user?.stripeCustomerId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userRef = await retrieveUserRefAdmin({ uid: session.user.id as string });
        if (!userRef) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userSnapshot = await userRef.get();
        const user = userSnapshot.data();

        // Ensure eBay data exists
        if (!user?.connectedAccounts) {
            return res.status(400).json({ error: 'No eBay data found for this user' });
        }

        // Remove the eBay tokens from the user object
        user.connectedAccounts.ebay = null;

        // Update the Firestore user document to remove eBay account data
        await userRef.update({ connectedAccounts: user.connectedAccounts });

        // Clear the cookies to avoid auto-login on next connect
        nookies.destroy({ res }, 'ebay_oauth_state', { path: '/' });

        return res.status(200).json({ message: 'eBay account disconnected successfully' });
    } catch (error) {
        console.error('Error disconnecting eBay account:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
