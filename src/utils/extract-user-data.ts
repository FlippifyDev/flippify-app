import * as constants from '@/utils/constants';
import { ISubscription, IUser } from "@/models/user";

/**
 * Fetches the user's member subscriptions
 * Working by returning the subscription with member in the name
 */
export function fetchUserSubscription(subscriptions: ISubscription[]): ISubscription | void {
    return subscriptions.find(sub => sub.name?.includes('member'));
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

export function fetchUserExpensesCount(user?: IUser) {
    const subscriptions = user?.store?.numExpenses?.subscriptions ?? 0;
    const oneTime = user?.store?.numExpenses?.oneTime ?? 0;

    return { subscriptions, oneTime };
}