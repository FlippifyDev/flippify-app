export type RecordType = "automatic" | "manual";
export type CurrencyType = "USD" | "GBP" | "EUR" | "AUD" | "CAD";
export type EmailVerification = "unverified" | "verifying" | "verified";
export type StoreType = "ebay" | "amazon" | "shopify";

interface IUser {
    id: string;
    connectedAccounts: IConnectedAccounts;
    email: string;
    username: string;
    stripeCustomerId: string;
    subscriptions: ISubscription[] | null;
    store: Record<StoreType, IStore> | null;
    referral: IReferral;
    preferences: IPreferences;
    authentication: IAuthentication;
    metaData: IMetaData;
}


interface INumListings {
    automatic: number;
    manual: number;
}

interface INumOrders {
    resetDate: string;
    automatic: number;
    manual: number;
    totalAutomatic: number;
    totalManual: number;
}

interface IStore {
    numListings: INumListings;
    numOrders: INumOrders;
    lastFetchedDate: ILastFetchedDate | null;
}


interface ILastFetchedDate {
    inventory: string;
    orders: string;
}

interface IAuthentication {
    emailVerified: EmailVerification;
}

interface IMetaData {
    image?: string;
    createdAt: string;
}

interface IConnectedAccounts {
    discord: IDiscord | null;
    ebay: IEbay | null;
}

interface ISubscription {
    id: string;
    name: string;
    override: boolean;
    createdAt: string;
}

interface IDiscord {
    discordId: string;
}

interface IEbay {
    ebayAccessToken: string;
    ebayRefreshToken: string;
    ebayTokenExpiry: number;
    error?: string;
    error_description?: string;
}

interface IReferral {
    referralCode: string;
    referredBy: string | null;
    validReferrals: string[];
    rewardsClaimed: number;
}

interface IPreferences {
    preferredEmail: string;
    locale: string;
    currency: CurrencyType;
}

export type { IUser, ISubscription, IEbay, IReferral, IPreferences, IConnectedAccounts };