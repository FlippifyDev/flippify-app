import { getTokensForApi } from "./tokens";

// Function to send request and handle token refresh if necessary
export async function sendApiRequest(endpoint: string, ebayAccessToken: string | null | undefined, customerId: string, requestNewTokens = false) {
	// Fetch the tokens (either from localStorage or by refreshing if specified)
	const apiAccessTokens = await getTokensForApi(ebayAccessToken, customerId, requestNewTokens);

	if (!apiAccessTokens) {
		throw new Error("User is not authenticated");
	}

	// Set up headers with the access token
	const headers = {
		Authorization: `Bearer ${apiAccessTokens.access_token}`,
	};

	try {
		const response = await fetch(`https://api.flippify.co.uk/${endpoint}`, {
			method: "GET",
			headers: headers,
		});

		return response;
	} catch (error) {
		throw error;
	}
}
