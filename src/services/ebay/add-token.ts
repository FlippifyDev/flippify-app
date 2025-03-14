import { firestore } from '@/lib/firebase/config';
import { IEbay } from '@/models/user';
import { Session } from 'next-auth';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

async function addEbayTokens(tokenData: IEbay, session: Session) {
    try {
        if (!session?.user?.id) {
            throw new Error("User is not authenticated");
        }

        console.log("Token Data: ", tokenData);

        // Ensure tokenData fields exist
        if (!tokenData.ebayAccessToken || !tokenData.ebayRefreshToken || !tokenData.ebayTokenExpiry) {
            throw new Error("Invalid eBay token data: Missing required fields.");
        }

        const userDocRef = doc(firestore, 'users', session.user.id);
        const userSnapshot = await getDoc(userDocRef);

        // Ensure connectedAccounts.ebay is an object, not null
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            if (!userData.connectedAccounts || userData.connectedAccounts.ebay === null) {
                await updateDoc(userDocRef, {
                    "connectedAccounts.ebay": {}
                });
            }
        } else {
            // If user document doesn't exist, create it
            await setDoc(userDocRef, { connectedAccounts: { ebay: {} } }, { merge: true });
        }

        // Prepare update data
        const updatedEbayData = {
            ebayAccessToken: tokenData.ebayAccessToken,
            ebayRefreshToken: tokenData.ebayRefreshToken,
            ebayTokenExpiry: Date.now() + tokenData.ebayTokenExpiry * 1000
        };

        // Update Firestore with new eBay token data
        await updateDoc(userDocRef, {
            "connectedAccounts.ebay": updatedEbayData
        });

        return { success: true };

    } catch (error) {
        console.error('Error adding eBay tokens:', error);
        return { error: `An error occurred while adding eBay tokens: ${error}, Token Data: ${tokenData}` };
    }
}

export { addEbayTokens };
