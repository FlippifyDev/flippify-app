'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import SideBarButton from './SideBarButton';
import { MdManageAccounts } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { FaUserPlus } from "react-icons/fa";
import SubscriptionWrapper from './SubscriptionWrapper';

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

    return (
        <div>
            <ul>
                <SubscriptionWrapper requiredSubscription="server">
                    <li>
                        <SideBarButton
                            text="Manage Servers"
                            redirect='manage-servers'
                            symbol={<MdManageAccounts className="text-md" />}
                        />
                    </li>
                </SubscriptionWrapper>
                
                <SubscriptionWrapper requiredSubscription="waitlistaccepted">
                    <li>
                        <SideBarButton 
                            text="Sales & Profits"
                            redirect='sales-tracker'
                            symbol={<AiOutlineStock className="text-md" />}
                        />
                    </li>
                </SubscriptionWrapper>

                <SubscriptionWrapper requiredSubscription="!waitlistaccepted">
                    <li>
                        <SideBarButton 
                            text="Join Waitlist"
                            redirect='join-waitlist'
                            symbol={<FaUserPlus className="text-md" />}
                        />
                    </li>
                </SubscriptionWrapper>
            </ul>
        </div>
    )
}

export default UserSidebarButtons;
