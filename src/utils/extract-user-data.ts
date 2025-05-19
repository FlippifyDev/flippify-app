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

export function fetchUserOrdersCount(user?: IUser): number {
    if (!user || !user.store?.numOrders) {
        return 0;
    }

    const numOrders = user.store?.numOrders;

    // Prefer the cumulative totals, otherwise fall back to the incremental counts
    const automaticCount = numOrders.totalAutomatic ?? 0;
    const manualCount = numOrders.totalManual ?? 0;

    return automaticCount + manualCount;
}

export function fetchUserListingsCount(user?: IUser): number {
    if (!user || !user.store?.numListings) {
        return 0;
    }

    const numListings = user.store.numListings;

    const automaticCount = numListings.automatic ?? 0;
    const manualCount = numListings.manual ?? 0;

    return automaticCount + manualCount;
}

export function fetchUserInventoryAndOrdersCount(
    user?: IUser
): {
    automaticListings: number;
    manualListings: number;
    automaticOrders: number;
    manualOrders: number;
} {
    const automaticListings = user?.store?.numListings?.automatic ?? 0;
    const manualListings = user?.store?.numListings?.manual ?? 0;

    const automaticOrders = user?.store?.numOrders?.automatic ?? 0;
    const manualOrders = user?.store?.numOrders?.manual ?? 0;

    return { automaticListings, manualListings, automaticOrders, manualOrders };
}