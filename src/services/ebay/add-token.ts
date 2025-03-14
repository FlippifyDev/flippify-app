import { firestore } from '@/lib/firebase/config';
import { IEbay } from '@/models/user';
import { Session } from 'next-auth';
import { doc, updateDoc } from 'firebase/firestore';

async function addEbayTokens(tokenData: IEbay, session: Session) {
    try {
        if (!session?.user?.id) {
            throw new Error("User is not authenticated");
        }

        const userDocRef = doc(firestore, 'users', session.user.id);

        await updateDoc(userDocRef, {
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
        return { error: `An error occurred while adding eBay tokens, ${error}` };
    }
}

export { addEbayTokens };

