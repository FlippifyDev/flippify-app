"use server"

import { firestoreAdmin } from "@/lib/firebase/config-admin";

async function refreshEbayToken(customerId: string): Promise<string> {
    try {
        // Retrieve the user from Firestore
        const userRef = firestoreAdmin.collection('users').doc(customerId);
        const userSnapshot = await userRef.get();
        const user = userSnapshot.data();

        if (!user || !user.connectedAccounts?.ebay?.ebayRefreshToken) {
            throw new Error('User or eBay refresh token not found');
        }

        const refreshToken = user.connectedAccounts.ebay.ebayRefreshToken;
        const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
        const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;

        const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        // Make the request to eBay to refresh the token
        const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        });

        // Check if the response is successful
        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            throw new Error(errorData.error_description || 'Error refreshing eBay token');
        }

        // Parse the token data
        const tokenData = await tokenResponse.json();

        // If there was an error from eBay, throw an error
        if (tokenData.error || !tokenData.ebayAccessToken || !tokenData.ebayTokenExpiry) {
            throw new Error(tokenData.error_description || 'Error refreshing eBay token');
        }

        // Prepare updated eBay token data
        const updatedEbayData = {
            ebayAccessToken: tokenData.ebayAccessToken,
            ebayTokenExpiry: Date.now() + tokenData.ebayTokenExpiry,
            ebayRefreshToken: tokenData.ebayRefreshToken || refreshToken
        };

        // Save the updated tokens back to Firestore
        await userRef.update({
            connectedAccounts: { "ebay": updatedEbayData }
        });

        // Return the new access token
        return tokenData.ebayAccessToken;
    } catch (error) {
        console.error('Error refreshing eBay token:', error);
        throw error; // Rethrow error to handle it further up the call stack if necessary
    }
}

export { refreshEbayToken };
