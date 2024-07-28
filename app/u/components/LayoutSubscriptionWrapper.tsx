'use client';

import React, { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LayoutSubscriptionWrapperProps {
    requiredSubscriptions: string[];
    children: ReactNode;
    redirectPath?: string;
}

export interface Subscription {
    name: string;
}

const LayoutSubscriptionWrapper: React.FC<LayoutSubscriptionWrapperProps> = ({ requiredSubscriptions, children, redirectPath }) => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || !session.user) {
            if (redirectPath) router.push(redirectPath);
            return;
        }

        const user = session.user;

        if (!user.subscriptions) {
            if (redirectPath) router.push(redirectPath);
            return;
        }

        const hasRequiredSubscriptions = checkSubscriptions(user.subscriptions, requiredSubscriptions);

        if (!hasRequiredSubscriptions && redirectPath) {
            router.push(redirectPath);
        }
    }, [session, requiredSubscriptions, redirectPath, router]);

    if (!session || !session.user || !session.user.subscriptions) return null;

    const hasRequiredSubscriptions = checkSubscriptions(session.user.subscriptions, requiredSubscriptions);

    return hasRequiredSubscriptions ? <>{children}</> : null;
};

const checkSubscriptions = (userSubscriptions: Subscription[], requiredSubscriptions: string[]) => {
    return requiredSubscriptions.every(sub => {
        const isNegation = sub.startsWith('!');
        const subscriptionToCheck = isNegation ? sub.slice(1).toLowerCase() : sub.toLowerCase();
        const hasSubscription = userSubscriptions.some(subscription =>
            subscription.name.toLowerCase().includes(subscriptionToCheck)
        );
        return isNegation ? !hasSubscription : hasSubscription;
    });
};

export default LayoutSubscriptionWrapper;
