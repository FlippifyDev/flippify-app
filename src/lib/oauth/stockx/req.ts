"use server";

import { retrieveUIDAdmin, retrieveConnectedAccount } from "@/services/firebase/admin-retrieve";
import { configDotenv } from "dotenv";

configDotenv()

export async function request({ idToken, query }: { idToken: string, query: string }): Promise<{ data?: any, error?: any }> {
    const uid = await retrieveUIDAdmin({ idToken });
    if (!uid) return { error: "Invalid id token" };

    const account = await retrieveConnectedAccount({ uid, storeType: "stockx" });

    if (!account) return { error: "StockX account is likely not connected" };

    const api_key = process.env.STOCKX_API_KEY;
    const jwt = account.stockxAccessToken;

    if (!api_key || !jwt) return { error: "Tokens not available" };

    const queryParams = new URLSearchParams({
        query: query,
        pageNumber: '1',
        pageSize: '30'
    }).toString();

    const resp = await fetch(
        `https://api.stockx.com/v2/catalog/search?${queryParams}`,
        {
            method: 'GET',
            headers: {
                'x-api-key': api_key,
                Authorization: `Bearer ${jwt}`
            }
        }
    );

    const data = await resp.text()
    return { data };
}