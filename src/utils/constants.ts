import { StoreType } from "@/models/store-data";

export const storePlatforms: Record<string, StoreType> = {
    "ebay": "ebay",
    "stockx": "stockx",
}

export const storeTokenKeys: Record<string, string> = {
    "ebay": "ebayAccessToken",
    "stockx": "stockxAccessToken"
}

export const cacheExpirationTime = 1000 * 60 * 30; // 30 min in milliseconds
export const inventoryCacheKey = "inventory"
export const orderCacheKey = "orders"
export const oneTimeExpensesCacheKey = "one-time-expenses"
export const subscriptionsExpensesCacheKey = "subscriptions-expenses"
export const statusCacheKey = "HsdaIDF89S"
export const statusCacheExpirationTime = 1000 * 60 * 2 // 2 min in milliseconds

export const enterpriseNames = ["enterprise 1", "enterprise 2", "enterprise 3", "enterprise 4"]
export const exportCSVAllowedSubscriptionPlans = ["standard", "pro", ...enterpriseNames];
export const importCSVAllowedSubscriptionPlans = ["standard", "pro", ...enterpriseNames];

export const defaultTimeFrom = "2020-01-01T00:00:00Z";

// Free
export const FREE_MAX_AUTOMATIC_LISTINGS = 12;
export const FREE_MAX_MANUAL_LISTINGS = 12;
export const FREE_ONE_TIME_EXPENSES = 12;
export const FREE_SUBSCRIPTION_EXPENSES = 3;

// Standard
export const STANDARD_MAX_AUTOMATIC_LISTINGS = 48;
export const STANDARD_SUBSCRIPTION_EXPENSES = 6;
export const STANDARD_UPLOAD_LIMIT = 100;

// Pro
export const PRO_MAX_AUTOMATIC_LISTINGS = 96;
export const PRO_UPLOAD_LIMIT = 200;


// Product IDs
export const FREE_MONTHLY_PID = "price_1R6umYJJRepiHZ8duYSajDvz";
export const FREE_YEARLY_PID = "price_1R6umYJJRepiHZ8d7eBwpE78";

export const STANDARD_MONTHLY_PID = "price_1RUpSIJJRepiHZ8dFz5gMa8q";
export const STANDARD_YEARLY_PID = "price_1RUpSYJJRepiHZ8dsqDOu8E7";

export const PRO_MONTHLY_PID = "price_1RUpTRJJRepiHZ8deNaVDIgK";
export const PRO_YEARLY_PID = "price_1RUpTrJJRepiHZ8d7IUkHgfI";

export const ENTERPRISE_MONTHLY_PIDS = [
    ["price_1RUUATJJRepiHZ8dq9X0ohAt", 49.99, 79.99],
    ["price_1RUpVDJJRepiHZ8dMiCS8BZv", 99.99, 119.99],
    ["price_1RUUATJJRepiHZ8dvdTq7k60", 149.99, 169.99],
    ["price_1RUUATJJRepiHZ8dAmJGNKcM", 199.99, 219.99]
]

export const ENTERPRISE_YEARLY_PIDS = [
    ["price_1RUUATJJRepiHZ8dH0nhGGP3", 499.90, 799.90],
    ["price_1RUUATJJRepiHZ8diwwFMeKS", 999.90, 1199.90],
    ["price_1RUUATJJRepiHZ8duKjoPTb2", 1499.90, 1699.90],
    ["price_1RUUATJJRepiHZ8d4CeCmheX", 1999.90, 2199.90]
]

export const subscriptionLimits = {
    "free": {
        "automatic": FREE_MAX_AUTOMATIC_LISTINGS,
        "manual": FREE_MAX_MANUAL_LISTINGS,
        "oneTimeExpenses": FREE_ONE_TIME_EXPENSES,
        "subscriptionExpenses": FREE_SUBSCRIPTION_EXPENSES,
        "upload-limit": 0
    },
    "standard": {
        "automatic": STANDARD_MAX_AUTOMATIC_LISTINGS,
        "subscriptionExpenses": STANDARD_SUBSCRIPTION_EXPENSES,
        "upload-limit": STANDARD_UPLOAD_LIMIT
    },
    "pro": {
        "automatic": PRO_MAX_AUTOMATIC_LISTINGS,
        "upload-limit": PRO_UPLOAD_LIMIT
    },
    "enterprise 1": {
        "automatic": 200,
        "upload-limit": 300

    },
    "enterprise 2": {
        "automatic": 500,
        "upload-limit": 400
    },
    "enterprise 3": {
        "automatic": 750,
        "upload-limit": 500
    },
    "enterprise 4": {
        "automatic": 1000,
        "upload-limit": 600
    },
}

export const MAX_INPUT_LENGTH = 40;

export const subscriptionPlans = {
    "Free - member": 0,
    "Standard - member": 1,
    "Pro - member": 2,
    "Enterprise 1 - member": 3,
    "Enterprise 2 - member": 4,
    "Enterprise 3 - member": 5,
    "Enterprise 4 - member": 6,
}


export const billingCycleOptions = [{ label: "Daily", value: "daily" }, { label: "Weekly", value: "weekly" }, { label: "Monthly", value: "monthly" }, { label: "Yearly", value: "yearly" }]


export const weeklyRenewalOptions = [
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
];

export const monthlyRenewalOptions = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return {
        label: `${day}${getOrdinalSuffix(day)}`,
        value: day.toString()
    };
})


function getOrdinalSuffix(n: number) {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
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