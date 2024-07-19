'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import SideBarButton from './SideBarButton';
import { MdManageAccounts } from "react-icons/md";
import { AiOutlineStock } from "react-icons/ai";
import { FaRegNewspaper } from "react-icons/fa6";
import SubscriptionWrapper from './SubscriptionWrapper';
import DisabledSideBarButton from './DisabledSideBarButton';

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
            {/* Member Buttons */}

            <SubscriptionWrapper requiredSubscriptions={['']}>
                <DisabledSideBarButton 
                    text="Reseller News"
                    redirect='sales-tracker'
                    symbol={<FaRegNewspaper className="text-md" />}
                    tooltip="Coming Soon"
                />
            </SubscriptionWrapper>
            
            <SubscriptionWrapper requiredSubscriptions={['server']}>
                <SideBarButton
                    text="Manage Servers"
                    redirect='manage-servers'
                    symbol={<MdManageAccounts className="text-md" />}
                />
            </SubscriptionWrapper>
            
            <SubscriptionWrapper requiredSubscriptions={['standard']}>
                <SideBarButton 
                    text="Sales & Profits"
                    redirect='sales-tracker'
                    symbol={<AiOutlineStock className="text-md" />}
                />
            </SubscriptionWrapper>

            {/* Disabled Buttons */}
            
            <SubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
                <DisabledSideBarButton 
                    text="Manage Servers"
                    redirect='sales-tracker'
                    symbol={<MdManageAccounts className="text-md" />}
                />
            </SubscriptionWrapper>

            <SubscriptionWrapper requiredSubscriptions={['!standard', '!server']}>
                <DisabledSideBarButton 
                    text="Sales & Profits"
                    redirect='sales-tracker'
                    symbol={<AiOutlineStock className="text-md" />}
                />
            </SubscriptionWrapper>

        </div>
    )
}

export default UserSidebarButtons;
