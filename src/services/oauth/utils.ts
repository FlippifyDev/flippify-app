import { refreshEbayToken } from "./ebay/refresh-token";
import { refreshStockXToken } from "./stockx/refresh-token";

export const accountToRefreshFunc = {
    "ebay": refreshEbayToken,
    "stockx": refreshStockXToken
}