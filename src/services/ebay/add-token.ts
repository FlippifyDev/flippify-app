"use server"

import { IUser } from '@/models/user';
import { firestoreAdmin } from '@/lib/firebase/config-admin';
import { retrieveConnectedAccount } from '../firebase/retrieve-admin';

import { Session } from 'next-auth';
import { retrieveIdToken } from '../firebase/retrieve';

async function addEbayTokens(tokenData: { access_token: string, refresh_token: string, expires_in: number, error?: string, error_description?: string }, session: Session) {
    try {
        if (!session?.user?.id) {
            throw new Error("User is not authenticated");
        }

        // Ensure tokenData fields exist
        if (!tokenData.access_token || !tokenData.refresh_token || !tokenData.expires_in) {
            throw new Error("Invalid eBay token data: Missing required fields.");
        }

        const userRef = firestoreAdmin.collection('users').doc(session.user.id);
        const userSnapshot = await userRef.get();

        // Ensure connectedAccounts.ebay is an object, not null
        if (userSnapshot.exists) {
            const userData = userSnapshot.data() as IUser;
            const idToken = await retrieveIdToken();
            if (!idToken) return;
            const connectedAccount = await retrieveConnectedAccount({ idToken, storeType: "ebay" })
            if (!userData.connectedAccounts || connectedAccount === null) {
                await userRef.update({
                    "connectedAccounts.ebay": {}
                })
            }
        } else {
            // If user document doesn't exist, create it
            await userRef.set({
                connectedAccounts: { ebay: {} }
            }, { merge: true });
        }

        // Prepare update data
        const updatedEbayData = {
            ebayAccessToken: tokenData.access_token,
            ebayRefreshToken: tokenData.refresh_token,
            ebayTokenExpiry: Date.now() + tokenData.expires_in * 1000
        };

        // Update Firestore with new eBay token data
        await userRef.update({
            "connectedAccounts.ebay": updatedEbayData
        });

        return { success: true };

    } catch (error) {
        console.error('Error adding eBay tokens:', error);
        return { error: `An error occurred while adding eBay tokens: ${error}, Token Data: ${tokenData}, ${tokenData.access_token} ${tokenData.refresh_token} ${tokenData.expires_in} ${tokenData.error} ${tokenData.error_description}` };
    }
}

export { addEbayTokens };
