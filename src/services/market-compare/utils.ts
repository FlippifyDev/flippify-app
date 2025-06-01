// Local Imports
import { IMarketListing, IMarketStats } from "@/models/market-compare";


export const platformToImage = {
    "ebay": "/connect-accounts/eBayLogo.png",
    "stockx": "/connect-accounts/StockXLogo.png"
}


export function isBlackListed({ value }: { value: string }) {
    for (const word of BLACK_LISTED_WORDS) {
        if (value.toLowerCase().includes(word.toLowerCase())) {
            return true;
        }
    }
    return false;
}


export function normaliseTitle({ value }: { value: string }) {
    let str = value.toLowerCase();
    // Step 1: Remove prices like $10, £20.50, €100, etc.
    str = str.replace(/[\$€£¥₹]\s*\d+(?:[.,]\d+)?/g, "");

    // Step 2: Remove emojis and many symbol ranges
    //    (Using Unicode codepoint escapes with the /u flag)
    const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2B00}-\u{2BFF}\u{1FA70}-\u{1FAFF}\u{FE0F}]+/gu;
    str = str.replace(emojiPattern, "");

    // Step 3: Remove zero-width or invisible characters (U+200B–U+200D, U+FEFF)
    str = str.replace(/[\u200B-\u200D\uFEFF]/g, " ");

    // Step 4: Process blacklist words
    for (let word of NORMALISE_TITLE_BLACKLISTED_WORDS) {
        const lowerWord = word.toLowerCase();

        // If the word is purely non-alphanumeric (e.g., "@@@", "!!!")
        if (/^[\W_]+$/.test(lowerWord)) {
            // Escape for use in regex, then replace all occurrences (case-insensitive)
            const escaped = lowerWord.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
            const rx = new RegExp(escaped, "gi");
            str = str.replace(rx, " ");
        } else {
            // Remove as a whole word (with optional trailing spaces or commas)
            const escaped = lowerWord.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
            const rx = new RegExp(`\\b${escaped}\\b[\\s,]*`, "gi");
            str = str.replace(rx, " ");
        }
    }

    // Step 5: Remove any trailing non-alphanumeric symbols
    str = str.replace(/[\W_]+$/g, " ");

    // Step 6: Remove extra punctuation or unnecessary spaces around commas/semicolons
    str = str.replace(/\s*[,;]\s*/g, " ");

    // Step 7: Collapse multiple spaces into one
    str = str.split(/\s+/).filter(Boolean).join(" ");

    // Step 8: Convert to Title Case (capitalize first letter of each word)
    const words = str.split(" ");
    const titled = words
        .map((w) => {
            if (w.length === 0) return "";
            return w[0].toUpperCase() + w.slice(1);
        })
        .join(" ");

    return titled.trim();
}


export function preprocessText(text: string): string {
    return text
        .toLowerCase()
        .replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, "");
}

function cosineSimilarity(a: string[], b: string[]): number {
    const terms = Array.from(new Set([...a, ...b]));
    const vectorize = (tokens: string[]) => terms.map(term => tokens.filter(t => t === term).length);

    const vecA = vectorize(a);
    const vecB = vectorize(b);

    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (magnitudeA * magnitudeB || 1);
}

export function filterMatchingProducts(keyword: string, products: IMarketListing[], threshold = 0.4) {
    const processedKeyword = preprocessText(keyword).split(' ');

    return products.filter((product) => {
        const processedTitle = preprocessText(product.title || "").split(' ');
        return cosineSimilarity(processedKeyword, processedTitle) >= threshold;
    });
  }


export function filterPrices(prices: number[]): number[] {
    if (prices.length === 0) return [];

    // Step 1 Sort ascending
    const sorted = [...prices].sort((a, b) => a - b);
    const n = sorted.length;

    // Step 2
    const rank20 = Math.floor(0.2 * (n - 1));
    const rank80 = Math.ceil(0.8 * (n - 1));
    const lowerBound = sorted[rank20];
    const upperBound = sorted[rank80];

    // 3) Filter
    return sorted.filter((p) => p >= lowerBound && p <= upperBound);
}


export function computeStats(arr: number[]): IMarketStats {
    const sorted = [...arr].sort((a, b) => a - b);
    const n = sorted.length;

    if (n === 0) {
        return { median: 0, mean: 0, min: 0, max: 0 }; // Handle empty array safely
    }

    // Mean
    const mean = sorted.reduce((sum, x) => sum + x, 0) / n;

    // Median
    let median: number;
    if (n % 2 === 1) {
        median = sorted[(n - 1) / 2];
    } else {
        median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    }

    // Min/Max
    const min = sorted[0];
    const max = sorted[n - 1];

    return {
        median: Number(median.toFixed(2)),
        mean: Number(mean.toFixed(2)),
        min,
        max
    };
  }

export const BLACK_LISTED_WORDS = [
    "ebay",
    "uber eats",
    "ubereats",
    "tesco express",
    "holiday",
    "membership",
    "subscription",
    "railcard",
    "hols",
    "cdkeys",
    "used",
    "itunes",
    "skyscanner",
    "ryanair",
    "refurbished",
    "store card"
]

export const NORMALISE_TITLE_BLACKLISTED_WORDS = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "black",
    "white",
    "gray",
    "pink",
    "brown",
    "silver",
    "xbox",
    "ps5",
    "pc",
    "switch",
    "gaming",
    "-",
    "(",
    ")",
    "*",
    "brand new",
    "In Store",
    "Open Box",
    "in stock now",
    "in stock",
    "new",
    "esports",
    "cpi",
    "matte",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "new",
    "®",
    "@",
    "™",
    ",",
    ";",
    "’",
    "'",
    "/",
    "!",
    "|",
    "–",
    "[",
    "]",
    "+",
    "free delivery",
    "free",
    "untested",
    "etc",
    "multiplatform",
    ".",
    ":",
    "never opened",
    "english",
    "in asda cashpot",
    "cashpot",
    "⬇",
    "100%",
    "The Perfect Gift",
    "Gift Set",
    "Valentines Gift",
    "Gift",
    "Present",
    "super fast delivery",
    "fast delivery",
    "delivery",
    "BNIB",
    "non stick",
    "Damaged Packaging",
    "Extra Trade In Bonus W Code",
    "W Code",
    "W Voucher",
    "Sold By",
    "Official Store",
    "With Nl Code",
    "C&C",
    "W Auto Discount & Code"
]