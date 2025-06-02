"use server"

async function refreshEbayToken({ refresh_token }: { refresh_token: string }): Promise<{ access_token: string, refresh_token: string, id_token: string, expires_in: number, error?: string, error_description?: string }> {
    const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
    const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;

    try {
        const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        // Make the request to eBay to refresh the token
        const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            return {
                access_token: "",
                refresh_token,
                id_token: "",
                expires_in: 0,
                error: errorData.error || "Unknown error",
                error_description: errorData.error_description || "Failed to refresh token from eBay."
            };
        }

        // Parse the token data
        const tokenData = await response.json();
        tokenData["refresh_token"] = refresh_token;

        return tokenData as { access_token: string, refresh_token: string, id_token: string, expires_in: number };
    } catch (error) {
        console.error('Error refreshing eBay token:', error);
        return {
            access_token: "",
            refresh_token,
            expires_in: 0,
            id_token: "",
            error: "An error occurred while requesting the eBay token via refresh.",
            error_description: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

export { refreshEbayToken };
