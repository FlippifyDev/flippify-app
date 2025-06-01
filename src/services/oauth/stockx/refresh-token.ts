"use server";

export async function refreshStockXToken({ refresh_token }: { refresh_token: string }): Promise<{ access_token: string, refresh_token: string, id_token: string, expires_in: number, error?: string, error_description?: string }> {
    const CLIENT_ID = process.env.NEXT_PUBLIC_STOCKX_CLIENT_ID;
    const CLIENT_SECRET = process.env.STOCKX_CLIENT_SECRET;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_STOCKX_REDIRECT_URI;

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        return {
            access_token: "",
            id_token: "",
            refresh_token,
            expires_in: 0,
            error: "Missing client credentials.",
            error_description: "Could not find client credentials."
        };
    }

    try {
        const response = await fetch('https://accounts.stockx.com/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                audience: 'gateway.stockx.com'
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                access_token: "",
                refresh_token,
                id_token: "",
                expires_in: 0,
                error: errorData.error || "Unknown error",
                error_description: errorData.error_description || "Failed to refresh token from StockX."
            };
        }
        const tokenData = await response.json();
        tokenData["refresh_token"] = refresh_token;

        return tokenData as { access_token: string, refresh_token: string, id_token: string, expires_in: number };

    } catch (error) {
        console.error('Error refreshing StockX token:', error);
        return {
            access_token: "",
            refresh_token,
            expires_in: 0,
            id_token: "",
            error: "An error occurred while requesting the StockX token via refresh.",
            error_description: error instanceof Error ? error.message : "Unknown error"
        };
    }
}