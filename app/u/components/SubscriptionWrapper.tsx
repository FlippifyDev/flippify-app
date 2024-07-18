'use client';

import React, { ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface SubscriptionWrapperProps {
    requiredSubscription: string;
    children: ReactNode;
}

export interface Subscription {
    name: string;
}

export interface CustomUser {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    subscriptions?: Subscription[];
}

const SubscriptionWrapper: React.FC<SubscriptionWrapperProps> = ({ requiredSubscription, children }) => {
    const { data: session } = useSession();

    if (!session || !session.user || !('subscriptions' in session.user)) {
        return null; // Handle case where session or subscriptions are not available
    }

    const { subscriptions } = session.user as CustomUser;

    if (!subscriptions) {
        return null;
    }

    const isNegation = requiredSubscription.startsWith('!');
    const subscriptionToCheck = isNegation ? requiredSubscription.slice(1) : requiredSubscription;

    const hasRequiredSubscription = subscriptions.some(subscription =>
        subscription.name.toLowerCase().includes(subscriptionToCheck.toLowerCase())
    );

    if (isNegation) {
        return !hasRequiredSubscription ? <>{children}</> : null;
    }

    return hasRequiredSubscription ? <>{children}</> : null;
};

export default SubscriptionWrapper;
