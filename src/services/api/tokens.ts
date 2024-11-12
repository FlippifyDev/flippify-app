import { loginToFlippifyAPI } from "./login";
import { refreshFlippifyAPITokens } from "./refresh";

export async function getTokensForApi(
	oauthToken: string | null | undefined,
	customerId: string,
	refreshTokens?: boolean
) {
	// First, check if the access and refresh tokens are already in localStorage
	const storedAccessToken = localStorage.getItem("apiAccessToken");
	const storedRefreshToken = localStorage.getItem("apiRefreshToken");

	if (storedAccessToken && storedRefreshToken && !refreshTokens) {
		// If both tokens are present in localStorage, return them
		return { access_token: storedAccessToken, refresh_token: storedRefreshToken };
	}

	// If refreshTokens is true, try to refresh the access token
	if (storedRefreshToken && refreshTokens) {
		const refreshedTokens = await refreshFlippifyAPITokens(storedRefreshToken);
		if (refreshedTokens?.access_token) {
			// Update access token in localStorage
			localStorage.setItem("apiAccessToken", refreshedTokens.access_token);
			return { access_token: refreshedTokens.access_token, refresh_token: storedRefreshToken };
		}
	}
	
	// If tokens are not in localStorage, log in to the API and store the tokens
	const tokens = await loginToFlippifyAPI(oauthToken, customerId);

	if (tokens) {
		// Store the tokens in localStorage for future use
		localStorage.setItem("apiAccessToken", tokens.access_token);
		localStorage.setItem("apiRefreshToken", tokens.refresh_token);
		return tokens;
	} else {
		// If login fails, return null
		return null;
	}
}
