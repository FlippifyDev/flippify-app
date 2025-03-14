export async function refreshFlippifyAPITokens(
	oauthToken: string | null | undefined
) {
	if (!oauthToken) {
		console.error("Refresh token is missing.");
		return null;
	}

	try {
		const response = await fetch(`https://api.flippify.io/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${oauthToken}`,  // Pass the refresh token as a Bearer token
			},
		});

		if (!response.ok) throw new Error("Failed to refresh Flippify API tokens.");

		const { access_token } = await response.json();  // Only expecting an access token
		return { access_token };
	} catch (error) {
		console.error("Error refreshing Flippify API tokens:", error);
		return null;
	}
}
