'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import SideBarButton from './SideBarButton';
import { MdManageAccounts } from "react-icons/md";



export interface Subscription {
    name: string;
}

export interface CustomUser {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    subscriptions?: Subscription[];
}


const UserSidebarButtons = () => {
    const { data: session } = useSession();
    
    if (!session || !session.user || !('subscriptions' in session.user)) {
        return null; // Handle case where session or subscriptions are not available
    }
    
    const { subscriptions } = session.user as CustomUser;
    
    if (!subscriptions) {
        return null;
    }

    // Check if any subscription name includes "Server"
    const hasServerSubscription = subscriptions.some(subscription =>
        subscription.name.toLowerCase().includes('server')
    );

    return (
        <div>
            <ul>
                {/* Render a single button if any subscription includes "Server" */}
                {hasServerSubscription && (
                    <li>
                        <SideBarButton
                            text="Manage Servers"
                            redirect='manage-server'
                            symbol={<MdManageAccounts className="text-md" />}
                        />
                    </li>
                )}

                {/* Render buttons for subscriptions that do not include "Server" */}
                {subscriptions.map((subscription, index) => {
                    if (subscription.name.toLowerCase().includes('server')) {
                        return null; // Skip rendering if the name includes "Server"
                    }

                    return (
                        <li key={index}>
                            <SideBarButton
                                text={subscription.name}
                                redirect='' // Add your redirect logic here
                                symbol={<MdManageAccounts className="text-md" />}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}

export default UserSidebarButtons

