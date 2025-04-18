"use server";

import dotenv from 'dotenv';

dotenv.config();

async function createEbayToken(code: string): Promise<{ access_token: string, refresh_token: string, expires_in: number, error?: string, error_description?: string }> {
	const CLIENT_ID = process.env.NEXT_PUBLIC_EBAY_CLIENT_ID;
	const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;
	const REDIRECT_URI = process.env.NEXT_PUBLIC_EBAY_REDIRECT_URI;

	if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
		return {
            access_token: "",
            refresh_token: "",
            expires_in: 0,
			error: "Missing client credentials.",
			error_description: "Could not find client credentials."
		};
	}

	const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

	try {
		const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
			method: 'POST',
			headers: {
				'Authorization': `Basic ${basicAuth}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
		});

		// Check if the response is OK (status code in the 200 range)
		if (!tokenResponse.ok) {
			const errorData = await tokenResponse.json();
			return {
                access_token: "",
                refresh_token: "",
                expires_in: 0,
				error: errorData.error || "Unknown error",
				error_description: errorData.error_description || "Failed to fetch token from eBay."
			};
		}

		// Assuming the response is in the correct format
		const tokenData = await tokenResponse.json();
        return tokenData as { access_token: string, refresh_token: string, expires_in: number };

	} catch (error) {
		console.error('Error while creating eBay token:', error);
		return {
            access_token: "",
            refresh_token: "",
            expires_in: 0,
			error: "An error occurred while requesting the eBay token.",
			error_description: error instanceof Error ? error.message : "Unknown error"
		};
	}
}

export { createEbayToken };
