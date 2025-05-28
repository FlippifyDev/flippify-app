'use client';

import React, { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ISubscription } from '@/models/user';

interface LayoutSubscriptionWrapperProps {
    requiredSubscriptions?: string[];
    anySubscriptions?: string[];
    children: ReactNode;
    redirectPath?: string;
    pagePath?: string;
}
const LayoutSubscriptionWrapper: React.FC<LayoutSubscriptionWrapperProps> = ({
    requiredSubscriptions = [],
    anySubscriptions = [],
    children,
    redirectPath,
    pagePath
}) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session?.user.subscriptions) {
            if (redirectPath) router.push(redirectPath);
            return;
        }

        // Check if access should be unrestricted
        const unrestrictedAccess = requiredSubscriptions.length === 1 && requiredSubscriptions[0] === '';

        if (!unrestrictedAccess) {
            const hasRequiredSubscriptions = checkSubscriptions(session.user.subscriptions, requiredSubscriptions);
            const hasAnySubscriptions = anySubscriptions.length === 0 || checkAnySubscriptions(session.user.subscriptions, anySubscriptions);

            if ((!hasRequiredSubscriptions || !hasAnySubscriptions) && redirectPath) {
                router.push(redirectPath);
            }
        }
    }, [session, requiredSubscriptions, anySubscriptions, redirectPath, router, status]);

    if (status === 'loading') {
        return null
    };

    if (!session?.user?.subscriptions) {
        window.location.reload()
        return null
    };

    // Allow access if requiredSubscriptions is ['']
    const unrestrictedAccess = requiredSubscriptions.length === 1 && requiredSubscriptions[0] === '';

    if (unrestrictedAccess) {
        return <>{children}</>;
    }

    const hasRequiredSubscriptions = checkSubscriptions(session.user.subscriptions, requiredSubscriptions);
    const hasAnySubscriptions = anySubscriptions.length === 0 || checkAnySubscriptions(session.user.subscriptions, anySubscriptions);

    return hasRequiredSubscriptions && hasAnySubscriptions ? <>{children}</> : null;
};

const checkSubscriptions = (userSubscriptions: ISubscription[], requiredSubscriptions: string[]) => {
    return requiredSubscriptions.every(sub => {
        const isNegation = sub.startsWith('!');
        const subscriptionToCheck = isNegation ? sub.slice(1).toLowerCase() : sub.toLowerCase();
        const hasSubscription = userSubscriptions.some(subscription =>
            typeof subscription.name === 'string' && subscription.name.toLowerCase().includes(subscriptionToCheck)
        );
        return isNegation ? !hasSubscription : hasSubscription;
    });
};

const checkAnySubscriptions = (userSubscriptions: ISubscription[], anySubscriptions: string[]) => {
    return anySubscriptions.some(sub => {
        const subscriptionToCheck = sub.toLowerCase();
        return userSubscriptions.some(subscription =>
            typeof subscription.name === 'string' && subscription.name.toLowerCase().includes(subscriptionToCheck)
        );
    });
};


export default LayoutSubscriptionWrapper;
