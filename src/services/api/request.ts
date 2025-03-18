// Function to send request and handle token refresh if necessary
export async function updateStoreInfo(endpoint: string, ebayAccessToken: string, uid: string): Promise<void> {
	// Set up headers with the access token
	const headers = {
        Authorization: `Bearer ${ebayAccessToken}`,
	};

    const url = new URL(`https://api.flippify.io/${endpoint}`);
    url.searchParams.append("uid", uid);

	try {
        const response = await fetch(url, {
			method: "GET",
			headers: headers
		});

        if (!response.ok) {
            throw new Error(`Failed to update store info | ${response.status} - ${response.statusText}`);
        }
	} catch (error) {
		console.error(error)
	}
}
