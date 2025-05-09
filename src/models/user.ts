import { StoreType } from "./store-data";

export type CurrencyType = "USD" | "GBP" | "EUR" | "AUD" | "CAD";
export type EmailVerification = "unverified" | "verifying" | "verified";

interface IUser {
    id?: string | null;
    connectedAccounts?: IConnectedAccounts | null;
    email?: string | null;
    username?: string | null;
    stripeCustomerId?: string | null;
    subscriptions?: ISubscription[] | null;
    store?: Record<StoreType | string, IStore> | null;
    referral?: IReferral | null;
    preferences?: IPreferences | null;
    authentication?: IAuthentication | null;
    metaData?: IMetaData | null;
}

interface INumListings {
    automatic?: number | null;
    manual?: number | null;
}

interface INumOrders {
    resetDate?: string | null;
    automatic?: number | null;
    manual?: number | null;
    totalAutomatic?: number | null;
    totalManual?: number | null;
}

interface IStore {
    numListings?: INumListings | null;
    numOrders?: INumOrders | null;
    lastFetchedDate?: ILastFetchedDate | null;
}

interface ILastFetchedDate {
    inventory?: string | null;
    orders?: string | null;
}

interface IAuthentication {
    emailVerified?: EmailVerification;
    onboarding?: boolean | null;
    subscribed?: "free" | "standard" | "pro" | "enterprise" | null;
}

interface IMetaData {
    image?: string | null;
    createdAt?: string | null;
}

interface IConnectedAccounts {
    discord?: IDiscord | null;
    ebay?: IEbay | null;
}

interface ISubscription {
    id?: string | null;
    name?: string | null;
    override?: boolean | null;
    createdAt?: string | null;
}

interface IDiscord {
    discordId?: string | null;
}

interface IEbay {
    ebayAccessToken?: string | null;
    ebayRefreshToken?: string | null;
    ebayTokenExpiry?: number | null;
    error?: string | null;
    error_description?: string | null;
}

interface IReferral {
    referralCode?: string | null;
    referredBy?: string | null;
    validReferrals?: string[] | null;
    rewardsClaimed?: number | null;
}

interface IPreferences {
    locale?: string | null;
    currency?: CurrencyType;
}

export type { IUser, ISubscription, IEbay, IReferral, IPreferences, IConnectedAccounts, IStore };