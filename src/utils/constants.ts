import { StoreType } from "@/models/store-data";

export const storePlatforms: Record<string, StoreType> = {
    "ebay": "ebay",
}


export const storeTokenKeys: Record<string, string> = {
    "ebay": "ebayAccessToken"
}

export const cacheExpirationTime = 1000 * 60 * 30; // 30 min in milliseconds
export const inventoryCacheKey = "inventory"
export const orderCacheKey = "orders"
export const oneTimeExpensesCacheKey = "one-time-expenses"
export const subscriptionsExpensesCacheKey = "subscriptions-expenses"
export const statusCacheKey = "HsdaIDF89S"
export const statusCacheExpirationTime = 1000 * 60 * 2 // 2 min in milliseconds

export const exportCSVAllowedSubscriptionPlans = ["standard", "pro", "enterprise"];
export const importCSVAllowedSubscriptionPlans = ["standard", "pro", "enterprise"];

export const defaultTimeFrom = "2023-01-01T00:00:00Z";

// Free
export const FREE_MAX_AUTOMATIC_LISTINGS = 12;
export const FREE_MAX_MANUAL_LISTINGS = 12;
export const FREE_ONE_TIME_EXPENSES = 12;
export const FREE_SUBSCRIPTION_EXPENSES = 6;

// Standard
export const STANDARD_MAX_AUTOMATIC_LISTINGS = 48;
export const STANDARD_MAX_MANUAL_LISTINGS = 48;
export const STANDARD_ONE_TIME_EXPENSES = 100;
export const STANDARD_SUBSCRIPTION_EXPENSES = 12;


// Pro
export const PRO_MAX_AUTOMATIC_LISTINGS = 96;
export const PRO_MAX_MANUAL_LISTINGS = 96;
export const PRO_ONE_TIME_EXPENSES = 200;
export const PRO_SUBSCRIPTION_EXPENSES = 24;

// Product IDs
export const FREE_MONTHLY_PID = "price_1R6umYJJRepiHZ8duYSajDvz";
export const FREE_YEARLY_PID = "price_1R6umYJJRepiHZ8d7eBwpE78";

export const STANDARD_MONTHLY_PID = "price_1R6umXJJRepiHZ8dXNPscGu8";
export const STANDARD_YEARLY_PID = "price_1R6umXJJRepiHZ8d473LpjVZ";

export const PRO_MONTHLY_PID = "price_1R6umUJJRepiHZ8dEZib7Bd1";
export const PRO_YEARLY_PID = "price_1R6umUJJRepiHZ8dUeqJXo5d";

export const ENTERPRISE_MONTHLY_PID = "price_1PfJ9YJJRepiHZ8d9ejubfba";
export const ENTERPRISE_YEARLY_PID = "price_1PfJ9YJJRepiHZ8dXJSNvIx6";

export const subscriptionLimits = {
    "free": {
        "automatic": FREE_MAX_AUTOMATIC_LISTINGS,
        "manual": FREE_MAX_MANUAL_LISTINGS,
        "oneTimeExpenses": FREE_ONE_TIME_EXPENSES,
        "subscriptionExpenses": FREE_SUBSCRIPTION_EXPENSES
    },
    "standard": {
        "automatic": STANDARD_MAX_AUTOMATIC_LISTINGS,
        "manual": STANDARD_MAX_MANUAL_LISTINGS,
        "oneTimeExpenses": STANDARD_ONE_TIME_EXPENSES,
        "subscriptionExpenses": STANDARD_SUBSCRIPTION_EXPENSES  
    },
    "pro": {
        "automatic": PRO_MAX_AUTOMATIC_LISTINGS,
        "manual": PRO_MAX_MANUAL_LISTINGS,
        "oneTimeExpenses": PRO_ONE_TIME_EXPENSES,
        "subscriptionExpenses": PRO_SUBSCRIPTION_EXPENSES
    },
    "enterprise": {
        "automatic": 1000,
        "manual": 1000,
        "oneTimeExpenses": 400,
        "subscriptionExpenses": 36
    },
}

export const MAX_INPUT_LENGTH = 40;

export const subscriptionPlans = {
    "Free - member": 0,
    "Standard - member": 1,
    "Pro - member": 2,
    "Enterprise - member": 3,
}


export const discordSupportLink = "https://discord.com/channels/1236428617962229830/1236436288442466394"
export const discordLink = "https://discord.gg/gNPYfe7YFm"
export const xLink = "https://x.com/flippify_io"
export const tiktokLink = "https://www.tiktok.com/@flippifyuk?lang=en"
export const instagramLink = "https://www.instagram.com/_flippify/"
export const productHuntLink = "https://www.producthunt.com/products/flippify"
export const githubLink = "https://github.com/FlippifyDev"

export const supportEmail = "support@flippify.io"

export const userProfileImages = [
    "https://i.imgur.com/CU6euIm.jpeg",
    "https://i.imgur.com/I8rDFTX.jpeg",
    "https://i.imgur.com/ggxucPi.jpeg",
    "https://i.imgur.com/d07ooVX.jpeg",
    "https://i.imgur.com/lAO9uGU.jpeg",
    "https://i.imgur.com/oWnQLeE.jpeg",
    "https://i.imgur.com/rtp0BHB.jpeg",
    "https://i.imgur.com/MIYfoiM.jpeg",
    "https://i.imgur.com/wmDbAAS.jpeg",
    "https://i.imgur.com/lVlgc6X.jpeg",
    "https://i.imgur.com/4Kl0QyX.jpeg",
    "https://i.imgur.com/4hQ4N5v.jpeg",
    "https://i.imgur.com/wG6E17v.jpeg",
    "https://i.imgur.com/Q3ckMYo.jpeg",
    "https://i.imgur.com/wlijB8O.jpeg",
    "https://i.imgur.com/Saylsin.jpeg",
    "https://i.imgur.com/gjUmuYK.jpeg",
    "https://i.imgur.com/pOz6aFO.jpeg",
    "https://i.imgur.com/XOGJHT0.jpeg",
    "https://i.imgur.com/KWNaRKj.jpeg",
    "https://i.imgur.com/Frl8XFd.jpeg",
    "https://i.imgur.com/XtIxPI9.jpeg",
    "https://i.imgur.com/oHxVhXm.jpeg",
    "https://i.imgur.com/Pp1kFwk.jpeg",
    "https://i.imgur.com/dhStiEs.jpeg",
    "https://i.imgur.com/dEmnnkC.jpeg",
    "https://i.imgur.com/7MbQOM2.jpeg",
    "https://i.imgur.com/9rSKaFA.jpeg",
    "https://i.imgur.com/LkciYM0.jpeg",
    "https://i.imgur.com/AgBtjWr.jpeg",
    "https://i.imgur.com/Czfw4o0.jpeg",
    "https://i.imgur.com/Gpa3JU5.jpeg",
    "https://i.imgur.com/safhKvE.jpeg"
]