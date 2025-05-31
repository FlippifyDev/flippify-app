"use server"

import { firestoreAdmin } from '@/lib/firebase/config-admin';

import { Session } from 'next-auth';
import { usersCol } from '../firebase/constants';


interface Props {
    store: string;
    tokenData: { access_token: string, refresh_token: string, id_token?: string, expires_in: number, error?: string, error_description?: string }
    session: Session
}
async function addToken({ store, tokenData, session }: Props) {
    try {
        if (!session?.user?.id) {
            throw new Error("User is not authenticated");
        }

        const updatedData = {
            [`${store}AccessToken`]: tokenData.access_token,
            [`${store}RefreshToken`]: tokenData.refresh_token,
            [`${store}TokenExpiry`]: Date.now() + tokenData.expires_in * 1000
        };

        // Ensure tokenData fields exist
        if (!tokenData.access_token || !tokenData.refresh_token || !tokenData.expires_in) {
            throw new Error(`Invalid token data: Missing required fields.`);
        }

        if (store === "stockx" && tokenData.id_token) {
            updatedData[`${store}IdToken`] = tokenData.id_token;
        }


        const userRef = firestoreAdmin.collection(usersCol).doc(session.user.id);
        const userSnapshot = await userRef.get();

        // Ensure connectedAccounts is an object, not null
        if (userSnapshot.exists) {
            const userData = userSnapshot.data();
            if (!userData) throw Error("Could not find user");

            const connectedAccount = userData.connectedAccounts?.[store];
            if (!userData.connectedAccounts || connectedAccount === null) {
                await userRef.update({
                    [`connectedAccounts.${store}`]: {}
                })
            }
        } else {
            // If user document doesn't exist, create it
            await userRef.set({
                connectedAccounts: { [store]: {} }
            }, { merge: true });
        }

        // Update Firestore with new token data
        await userRef.update({
            [`connectedAccounts.${store}`]: updatedData
        });

        return { success: true };

    } catch (error) {
        console.error('Error adding tokens:', error);
        return { error: `An error occurred while adding tokens: ${error}, Access Token ${tokenData.access_token} | Refresh Token ${tokenData.refresh_token} | Expiry ${tokenData.expires_in} | Error ${tokenData.error} | Error Description ${tokenData.error_description}` };
    }
}

export { addToken };
