type RecordType = "automatic" | "manual";
type EmailVerification = "unverified" | "verifying" | "verified";

interface IUser {
    id: string;
    connectedAccounts: IConnectedAccounts;
    email: string; 
    username: string | null;
    stripeCustomerId: string;
    subscriptions: ISubscription[] | null;
    referral: IReferral;
    inventory: { ebay: IEbayInventory | null };
    orders: { ebay: IEbayOrders | null };
    numListings: { automatic: number, manual: number } | null;
    numOrders: { automatic: number, manual: number } | null;
    lastFetchedDate: { inventory: string, orders: string } | null;
    preferences: IPreferences;
    authentication: IAuthentication;
    metaData: IMetaData;
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
}

interface IDiscord {
    discordId: string;
}

interface IEbay {
    ebayAccessToken: string;
    ebayRefreshToken: string;
    ebayTokenExpiry: string;
}

interface IReferral {
    referralCode: string;
    referredBy: string | null;
    validReferrals: string[];
    rewardsClaimed: number;
}

interface IEbayInventory {
    itemId: string;
    itemName: string;
    price: number;
    quantity: number;
    dateListed: string;
    images: string[];
    recordType: RecordType;
}

interface IEbayOrders {
    additionalFees: number;
    buyerUsername: string;
    customTag: string;
    images: string[];
    itemName: string;
    legacyItemId: string;
    listingDate: string;
    orderId: string;
    purchaseDate: string;
    purchasePlatform: string;
    purchasePrice: number;
    quantitySold: number;
    recordType: RecordType;
    saleDate: string;
    salePlatform: string;
    salePrice: number;
    shippingFees: number;
}

interface IPreferences {
    notificationsEnabled: boolean;
    preferredEmail: string;
    locale: string;
}

export type { IUser, ISubscription, IEbay, IReferral, IEbayInventory, IEbayOrders, IPreferences, RecordType, IConnectedAccounts };