'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
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
                            redirect='manage-servers'
                            symbol={<MdManageAccounts className="text-md" />}
                        />
                    </li>
                )}
            </ul>
        </div>
    )
}

export default UserSidebarButtons

