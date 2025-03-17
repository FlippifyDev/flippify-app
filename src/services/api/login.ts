export async function loginToFlippifyAPI(
	oauthToken: string | null | undefined,
	uid: string
): Promise<{ access_token: string; refresh_token: string } | null> {
	try {
		const response = await fetch(`https://api.flippify.io/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
            body: JSON.stringify({ token: oauthToken, uid: uid }),
		});

		if (!response.ok) throw new Error("Failed to log in to Flippify API");

		const { access_token, refresh_token } = await response.json();

		return { access_token, refresh_token };
	} catch (error) {
		console.error("Error logging into Flippify API:", error);
		return null;
	}
}
