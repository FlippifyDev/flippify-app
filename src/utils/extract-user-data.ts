import * as constants from '@/utils/constants';
import { IStore, ISubscription, IUser } from "@/models/user";
import { StoreType } from '@/models/store-data';

/**
 * Fetches the user's member subscriptions
 * Working by returning the subscription with member in the name
 */
export function fetchUserSubscription(subscriptions: ISubscription[]): ISubscription | void {
    return subscriptions.find(sub => sub.name?.includes('member'));
}


export function fetchSubscriptionMaxListings(subscription: ISubscription) {
    switch (subscription.name) {
        case 'Standard - member':
            return {
                automatic: constants.STANDARD_MAX_AUTOMATIC_LISTINGS,
                manual: constants.STANDARD_MAX_MANUAL_LISTINGS
            }
        case 'Premium - member':
            return {
                automatic: constants.PREMIUM_MAX_AUTOMATIC_LISTINGS,
                manual: constants.PREMIUM_MAX_MANUAL_LISTINGS
            }
        default:
            return {
                automatic: constants.FREE_MAX_AUTOMATIC_LISTINGS,
                manual: constants.FREE_MAX_MANUAL_LISTINGS
            }
    }
}

export function fetchUserStores(user: IUser): StoreType[] {
    // If there's no store map, return an empty array
    if (!user.store) {
        return [];
    }

    // Otherwise, grab all the IStore values from the record
    return Object.keys(user.store);
}


export function fetchUserOrdersCount(user?: IUser): number {
    if (!user || !user.store) {
        return 0;
    }

    let totalOrders = 0;

    for (const [, store] of Object.entries(user.store)) {
        const numOrders = store.numOrders;
        if (!numOrders) continue;

        // Prefer the cumulative totals, otherwise fall back to the incremental counts
        const automaticCount = numOrders.totalAutomatic ?? numOrders.automatic ?? 0;
        const manualCount = numOrders.totalManual ?? numOrders.manual ?? 0;

        totalOrders += automaticCount + manualCount;
    }

    return totalOrders;
}


export function fetchUserListingsCount(user?: IUser): number {
    if (!user || !user.store) {
        return 0;
    }

    let totalListings = 0;

    for (const [, store] of Object.entries(user.store)) {
        const numListings = store.numListings;
        if (!numListings) continue;

        const automaticCount = numListings.automatic ?? 0;
        const manualCount = numListings.manual ?? 0;

        totalListings += automaticCount + manualCount;
    }

    return totalListings;
}

export function fetchUserInventoryAndOrdersCount(
    user?: IUser
): {
    automaticListings: number;
    manualListings: number;
    automaticOrders: number;
    manualOrders: number;
} {
    if (!user?.store) {
        return { automaticListings: 0, manualListings: 0, automaticOrders: 0, manualOrders: 0 };
    }

    let automaticListings = 0;
    let manualListings = 0;
    let automaticOrders = 0;
    let manualOrders = 0;

    for (const [, store] of Object.entries(user.store)) {
        // --- Listings ---
        const numListings = store.numListings;
        if (numListings) {
            automaticListings += numListings.automatic ?? 0;
            manualListings += numListings.manual ?? 0;
        }

        // --- Orders ---
        const numOrders = store.numOrders;
        if (numOrders) {
            // if you prefer the cumulative totals instead, use:
            //   numOrders.totalAutomatic ?? numOrders.automatic ?? 0
            //   numOrders.totalManual    ?? numOrders.manual    ?? 0
            automaticOrders += numOrders.automatic ?? 0;
            manualOrders += numOrders.manual ?? 0;
        }
    }

    return { automaticListings, manualListings, automaticOrders, manualOrders };
}