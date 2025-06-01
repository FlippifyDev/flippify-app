
import { IMarketSoldItem, IMarketListedItem } from "@/models/market-compare";
import { scrapeSold as ebayScrapeSold, scrapeListed as ebayScrapeListed } from "./ebay";
import { scrapeListed as stockxScrapeListed } from "./stockx";

export const fetchFunctions: Record<
    string,
    (args: { query: string }) => Promise<{ item?: IMarketListedItem | IMarketSoldItem, error?: string }>
> = {
    ebayListed: ebayScrapeListed,
    ebaySold: ebayScrapeSold,
    //stockxListed: stockxScrapeListed 
};