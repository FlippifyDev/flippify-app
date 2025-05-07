// Local Imports
import { IUser } from '@/models/user';
import { updateUser } from '@/services/firebase/update';
import { retrieveUserRefAdmin } from '@/services/firebase/retrieve-admin';

// External Imports
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nookies from 'nookies';
import { retrieveUserAdmin } from '@/services/firebase/retrieve-admin';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });

        if (!session || !session.user?.stripeCustomerId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userRef = await retrieveUserRefAdmin(session.user.id as string);
        if (!userRef) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userSnapshot = await userRef.get();
        const user = userSnapshot.data() as IUser;

        // Ensure eBay data exists
        if (!user.connectedAccounts?.ebay) {
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
