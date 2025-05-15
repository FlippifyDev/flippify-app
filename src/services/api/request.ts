import { storeTokenKeys } from "@/utils/constants";
import { IFirebaseConfig } from "@/models/config";
import { retrieveConnectedAccount } from "../firebase/retrieve-admin";
import { HardcodedStoreType, STORES, StoreType } from "@/models/store-data";

const root = "https://api.flippify.io"

// Function to send request and handle token refresh if necessary
export async function updateStoreInfo(endpoint: string, storeType: StoreType, uid: string): Promise<void> {
    // Set up headers with the access token
    if (!STORES.includes(storeType as HardcodedStoreType)) return;

    const account = await retrieveConnectedAccount(uid, storeType);
    const accessToken = account[storeTokenKeys[storeType]];

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Accept": "*/*",
        "Origin": "https://flippify.io",
        "Referer": "https://flippify.io/",
        "Content-Type": "application/json",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
    };

    const url = new URL(`${root}/v1/update/${endpoint}`);
    url.searchParams.append("uid", uid);
    url.searchParams.append("store_type", storeType);

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