// External Imports
import nookies from 'nookies';
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

// Local Imports
import { retrieveUserRefAdmin } from "@/services/firebase/admin-retrieve";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession({ req });

        if (!session || !session.user?.stripeCustomerId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const store = req.query.store as string;

        if (!store) {
            return res.status(400).json({ error: 'Missing store parameter' });
        }

        const userRef = await retrieveUserRefAdmin({ uid: session.user.id as string });
        if (!userRef) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userSnapshot = await userRef.get();
        const user = userSnapshot.data();

        // Ensure connectedAccounts exists
        if (!user?.connectedAccounts || !(store in user.connectedAccounts)) {
            return res.status(400).json({ error: `No ${store} data found for this user` });
        }

        // Remove the store tokens from the user object
        user.connectedAccounts[store] = null;

        // Update the Firestore user document
        await userRef.update({ connectedAccounts: user.connectedAccounts });

        // Clear cookies if needed (example for StockX)
        if (store === 'stockx') {
            nookies.destroy({ res }, 'stockx_oauth_state', { path: '/' });
        }

        return res.status(200).json({ message: `${store} account disconnected successfully` });
    } catch (error) {
        console.error('Error disconnecting account:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
