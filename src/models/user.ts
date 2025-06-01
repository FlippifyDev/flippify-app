export type CurrencyType = "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";;
export type EmailVerification = "unverified" | "verifying" | "verified";
export type Enterprise = "enterprise 1" | "enterprise 2" | "enterprise 3" | "enterprise 4"

interface IUser {
    id?: string | null;
    email?: string | null;
    username?: string | null;
    connectedAccounts?: null;
    stripeCustomerId?: string | null;
    subscriptions?: ISubscription[] | null;
    store?: IStore | null;
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

interface IExpenses {
    subscriptions?: number | null;
    oneTime?: number | null;
    totalOneTime?: number | null;
    resetDate?: string | null;
}

interface IStore {
    numListings?: INumListings | null;
    numOrders?: INumOrders | null;
    numExpenses?: IExpenses | null;
    [key: string]: {
        lastFetchedDate?: ILastFetchedDate | null;
    } | INumListings | INumOrders | IExpenses | null | undefined;
}

interface ILastFetchedDate {
    inventory?: string | null;
    orders?: string | null;
}

interface IAuthentication {
    emailVerified?: EmailVerification;
    onboarding?: boolean | null;
    subscribed?: "free" | "standard" | "pro" | Enterprise | null;
}

interface IMetaData {
    image?: string | null;
    createdAt?: string | null;
}

interface ISubscription {
    id?: string | null;
    name?: string | null;
    override?: boolean | null;
    createdAt?: string | null;
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

export type { IUser, ISubscription, IReferral, IPreferences, IStore };