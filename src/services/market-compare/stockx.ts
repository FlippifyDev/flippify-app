import { request } from "@/lib/oauth/stockx/req";
import { retrieveIdToken } from "../firebase/retrieve";
import { IMarketListedItem } from "@/models/market-compare";

export async function scrapeListed({ query }: { query: string }): Promise<{ item?: IMarketListedItem, error?: any }> {
    try {
        const idToken = await retrieveIdToken();
        if (!idToken) return { error: "Id token not found" };

        const res = await request({ idToken, query });
        if (res.error) throw res.error;

        const data = res.data;
        
        return data.products;
    } catch (error) {
        console.error(error);
        return { error: `${error}` }
    }
}
