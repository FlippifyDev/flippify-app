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

export interface CustomUser {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    subscriptions?: Subscription[] | null | undefined;
}

const LayoutSubscriptionWrapper: React.FC<LayoutSubscriptionWrapperProps> = ({ requiredSubscriptions, children, redirectPath }) => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || !session.user) {
            if (redirectPath) router.push(redirectPath);
            return;
        }

        const user = session.user as CustomUser;

        if (!user.subscriptions) {
            if (redirectPath) router.push(redirectPath);
            return;
        }

        const hasRequiredSubscriptions = requiredSubscriptions.every(sub => {
            const isNegation = sub.startsWith('!');
            const subscriptionToCheck = isNegation ? sub.slice(1) : sub;
            const hasSubscription = user.subscriptions!.some(subscription =>
                subscription.name.toLowerCase().includes(subscriptionToCheck.toLowerCase())
            );
            return isNegation ? !hasSubscription : hasSubscription;
        });

        if (!hasRequiredSubscriptions && redirectPath) {
            router.push(redirectPath);
        }
    }, [session, requiredSubscriptions, redirectPath, router]);

    if (!session || !session.user) return null;

    const user = session.user as CustomUser;

    if (!user.subscriptions) return null;

    const hasRequiredSubscriptions = requiredSubscriptions.every(sub => {
        const isNegation = sub.startsWith('!');
        const subscriptionToCheck = isNegation ? sub.slice(1) : sub;
        const hasSubscription = user.subscriptions!.some(subscription =>
            subscription.name.toLowerCase().includes(subscriptionToCheck.toLowerCase())
        );
        return isNegation ? !hasSubscription : hasSubscription;
    });

    return hasRequiredSubscriptions ? <>{children}</> : null;
};

export default LayoutSubscriptionWrapper;
