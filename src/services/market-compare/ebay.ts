// Local Imports
import { IMarketSoldItem, IMarketListing, IMarketStats, IMarketListedItem } from "@/models/market-compare";
import { request } from "./req";

// External Imports
import * as cheerio from "cheerio";
import { computeStats, filterMatchingProducts, filterPrices, isBlackListed, normaliseTitle } from "./utils";
import { differenceInDays, parse } from "date-fns";
import { enGB } from "date-fns/locale";


export async function scrapeSold({ query }: { query: string }): Promise<{ item?: IMarketSoldItem, error?: any }> {
    const keyword = query.replace(/\//g, "");
    const encodedQuery = encodeURIComponent(keyword);

    const url = `https://www.ebay.com/sch/i.html?_fsrp=1&rt=nc&_from=R40&_nkw=${encodedQuery}&_sacat=0&LH_Sold=1&LH_Complete=1`;

    try {
        // Step 1: Retrieve HTML
        const html = await request({ url });
        if (typeof html !== "string") {
            return { error: "Failed to fetch HTML" };
        }

        // Step 2: Load HTML into Cheerio
        const $ = cheerio.load(html);

        const now = new Date();
        let productCount = 0;
        let soldLast7Days = 0;
        let soldLastMonth = 0;
        const listings: IMarketListing[] = [];

        $("li.s-item.s-item__pl-on-bottom").each((_, el) => {
            if (productCount >= 31) {
                return false;
            }
            productCount++;

            // Step 1: Extract Title
            const titleElem = $(el).find("div.s-item__title");
            if (!titleElem.length) {
                return;
            }
            let title = titleElem.text().trim();
            if (isBlackListed({ value: title })) {
                return; // skip blacklisted
            }
            title = normaliseTitle({ value: title });

            // 4b) Extract sell date
            const sellDateElem = $(el).find("span.s-item__caption--signal.POSITIVE");

            let sellDate: Date | null = null;
            if (sellDateElem.length) {
                const sellDateRaw = sellDateElem
                    .text()
                    .replace("Sold", "")
                    .trim(); // e.g. "10 Jun 2025"
                try {
                    sellDate = parse(sellDateRaw, "MMM dd, yyyy", new Date(), {
                        locale: enGB,
                    });
                } catch {
                    return; // cannot parse date, skip
                }

                const daysAgo = differenceInDays(now, sellDate);
                if (daysAgo <= 7) {
                    soldLast7Days++;
                } else if (daysAgo <= 30) {
                    soldLastMonth++;
                } else {
                    return
                }
            } else {
                return; // no sell date found, skip
            }


            // 4d) Extract price
            const priceElem = $(el).find("span.s-item__price");
            if (!priceElem.length) {
                return; // no price, skip
            }
            let priceText = priceElem.first().text().trim();
            // If price range ("$10.00 to $15.00"), take the second part
            if (priceText.includes("to")) {
                priceText = priceText.split("to")[1].trim();
            }
            // Remove any currency symbols, commas, spaces
            priceText = priceText.replace(/[$£, ]/g, "");
            const price = parseFloat(priceText);
            if (isNaN(price)) {
                return; // invalid price, skip
            }
            const roundedPrice = Math.round(price * 100) / 100;

            listings.push({
                title,
                price: roundedPrice,
                date: sellDate,
            });
        });

        if (listings.length === 0) {
            return { error: "No results found (Listings 0)" };
        }

        const matchingProducts = filterMatchingProducts(keyword, listings);
        if (matchingProducts.length === 0) {
            return { error: "No results found (Matching Products 0)" };
        }

        // Step 4: Extract prices
        const prices = matchingProducts.map((p) => p.price ?? 0).filter((p) => p !== null);
        if (!prices.length) {
            return { error: "No results found (Prices 0)" };
        }

        // Step 5: Remove top 20% / bottom 20%
        const filteredPrices = filterPrices(prices);
        if (!filteredPrices.length) {
            return { error: "No results found (Filtered Prices 0)" };
        }

        // Step 6: Compute stats
        const stats: IMarketStats = computeStats(filteredPrices);

        // Build the IMarketItem
        const marketItem: IMarketSoldItem = {
            platform: "eBay",
            title: keyword,
            link: url,
            sales: {
                week: soldLast7Days,
                month: soldLastMonth,
            },
            price: stats,
        };

        return { item: marketItem };
    } catch (error) {
        console.error(error)
        return { error: `${error}` }
    }
}


export async function scrapeListed({ query }: { query: string }): Promise<{ item?: IMarketListedItem, error?: any }> {
    const keyword = query.replace(/\//g, "");
    const encodedQuery = encodeURIComponent(keyword);

    const url = `https://www.ebay.com/sch/i.html?_fsrp=1&rt=nc&_from=R40&_nkw=${encodedQuery}&_sacat=0`;

    try {
        // Step 1: Retrieve HTML
        const html = await request({ url });
        if (typeof html !== "string") {
            return { error: "Failed to fetch HTML" };
        }

        // Step 2: Load HTML into Cheerio
        const $ = cheerio.load(html);

        let productCount = 0;
        let freeDelieveryCount = 0;
        const listings: IMarketListing[] = [];

        $("li.s-item.s-item__pl-on-bottom").each((_, el) => {
            if (productCount >= 31) {
                return false;
            }
            productCount++;

            // Step 1: Extract Title
            const titleElem = $(el).find("div.s-item__title");
            if (!titleElem.length) {
                return;
            }
            let title = titleElem.text().trim();
            if (isBlackListed({ value: title })) {
                return; // skip blacklisted
            }
            title = normaliseTitle({ value: title });

            // 4d) Extract price
            const priceElem = $(el).find("span.s-item__price");
            if (!priceElem.length) {
                return; // no price, skip
            }
            let priceText = priceElem.first().text().trim();
            // If price range ("$10.00 to $15.00"), take the second part
            if (priceText.includes("to")) {
                priceText = priceText.split("to")[1].trim();
            }
            // Remove any currency symbols, commas, spaces
            priceText = priceText.replace(/[$£, ]/g, "");
            const price = parseFloat(priceText);
            if (isNaN(price)) {
                return; // invalid price, skip
            }
            const roundedPrice = Math.round(price * 100) / 100;

            const freeDeliveryElem = $(el).find(".s-item__shipping");
            if (!freeDeliveryElem.length) return;

            let shipping = freeDeliveryElem.text().trim()
            if (shipping.toLowerCase().includes("free")) {
                freeDelieveryCount++;
            }

            listings.push({
                title,
                price: roundedPrice,
            });
        });

        if (listings.length === 0) {
            throw Error("No results found (Listings 0)");
        }

        const matchingProducts = filterMatchingProducts(keyword, listings);
        if (matchingProducts.length === 0) {
            throw Error("No results found (Matching Products 0)");
        }

        // Step 4: Extract prices
        const prices = matchingProducts.map((p) => p.price ?? 0).filter((p) => p !== null);
        if (!prices.length) {
            throw Error("No results found (Prices 0)");
        }

        // Step 5: Remove top 20% / bottom 20%
        const filteredPrices = filterPrices(prices);
        if (!filteredPrices.length) {
            throw Error("No results found (Filtered Prices 0)");
        }

        // Step 6: Compute stats
        const stats: IMarketStats = computeStats(filteredPrices);

        // Build the IMarketItem
        const marketItem: IMarketListedItem = {
            platform: "eBay",
            title: keyword,
            link: url,
            freeDelieveryAmount: freeDelieveryCount,
            amount: productCount,
            price: stats,
        };

        return { item: marketItem };
    } catch (error) {
        console.error(error)
        return { error: `${error}` }
    }
}
