export type RecordType = "automatic" | "manual";
export type CurrencyType = "USD" | "GBP" | "EUR" | "AUD" | "CAD";
export type EmailVerification = "unverified" | "verifying" | "verified";

interface IUser {
    id: string;
    connectedAccounts: IConnectedAccounts;
    email: string;
    username: string | null;
    stripeCustomerId: string;
    subscriptions: ISubscription[] | null;
    referral: IReferral;
    numListings: { automatic: number, manual: number } | null;
    numOrders: { automatic: number, manual: number } | null;
    lastFetchedDate: { ebay: ILastFetchedDate } | null;
    preferences: IPreferences;
    authentication: IAuthentication;
    metaData: IMetaData;
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