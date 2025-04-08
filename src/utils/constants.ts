import { StorePlatform } from "@/models/store-data";

export const storePlatforms: Record<string, StorePlatform> = {
    "ebay": "ebay",
    "amazon": "amazon",
    "shopify": "shopify",
}

export const cacheExpirationTime = 1000 * 60 * 30; // 30 min in milliseconds
export const ebayInventoryCacheKey = "ebay-inventory"
export const ebayOrderCacheKey = "ebay-orders"

// Free
export const FREE_MAX_AUTOMATIC_LISTINGS = 20;
export const FREE_MAX_MANUAL_LISTINGS = 20;

// Standard
export const STANDARD_MAX_AUTOMATIC_LISTINGS = 100;
export const STANDARD_MAX_MANUAL_LISTINGS = 100;

// Pro
export const PREMIUM_MAX_AUTOMATIC_LISTINGS = 500;
export const PREMIUM_MAX_MANUAL_LISTINGS = 500;

export const subscriptionLimits = {
    "free": {
        "automatic": FREE_MAX_AUTOMATIC_LISTINGS,
        "manual": FREE_MAX_MANUAL_LISTINGS,
    },
    "standard": {
        "automatic": STANDARD_MAX_AUTOMATIC_LISTINGS,
        "manual": STANDARD_MAX_MANUAL_LISTINGS,
    },
    "pro": {
        "automatic": PREMIUM_MAX_AUTOMATIC_LISTINGS,
        "manual": PREMIUM_MAX_MANUAL_LISTINGS,
    },
    "enterprise": {
        "automatic": 1000,
        "manual": 1000,
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