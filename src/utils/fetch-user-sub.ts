import * as constants from '@/utils/constants';
import { ISubscription } from "@/models/user";

/**
 * Fetches the user's member subscriptions
 * Working by returning the subscription with member in the name
 */
export function fetchUserSubscription(subscriptions: ISubscription[]): ISubscription | void {
    return subscriptions.find(sub => sub.name.includes('member'));
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