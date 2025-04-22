import { IFirebaseConfig } from "@/models/config";

// Function to send request and handle token refresh if necessary
export async function updateStoreInfo(endpoint: string, ebayAccessToken: string, uid: string): Promise<void> {
    // Set up headers with the access token
    const headers = {
        Authorization: `Bearer ${ebayAccessToken}`,
        "Accept": "*/*",
        "Origin": "https://flippify.io",
        "Referer": "https://flippify.io/",
        "Content-Type": "application/json",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
    };

    const url = new URL(`https://api.flippify.io/v1/update`);
    url.searchParams.append("uid", uid);
    url.searchParams.append("store_type", "ebay");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Failed to update store info | ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error(error)
    }
}


export async function retrieveStatus(): Promise<IFirebaseConfig | void> {
    // Set up headers with the access token
    const headers = {
        "Accept": "*/*",
        "Origin": "https://flippify.io",
        "Referer": "https://flippify.io/",
        "Content-Type": "application/json",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
    };

    const url = new URL(`https://api.flippify.io/status`);
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch status info | ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data as IFirebaseConfig;

    } catch (error) {
        console.error(error)
    }
}