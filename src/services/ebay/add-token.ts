import { firestoreAdmin } from '@/lib/firebase/config-admin';
import { IEbay } from '@/models/user';

import { Session } from 'next-auth';

async function addEbayTokens(tokenData: IEbay, session: Session) {
    try {
        if (!session?.user?.id) {
            throw new Error("User is not authenticated");
        }

        const userDocRef = firestoreAdmin.collection('users').doc(session.user.id);

        await userDocRef.update({
            connectedAccounts: {
                ebay: {
                    accessToken: tokenData.ebayAccessToken,
                    refreshToken: tokenData.ebayRefreshToken,
                    tokenExpiry: Date.now() + tokenData.ebayTokenExpiry * 1000
                }
            }
        });

        return { success: true };

    } catch (error) {
        console.error('Error adding eBay tokens:', error);
        return { error: 'An error occurred while adding eBay tokens' };
    }
}

export { addEbayTokens };

