"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import WebhookInfo from './WebhookInfo';

export interface Subscription {
  name: string;
}

export interface CustomUser {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  subscriptions?: Subscription[];
}

const SelectSubscription = () => {
    const { data: session } = useSession();
    const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null); // State to track selected subscription
  

    if (!session || !session.user || !("subscriptions" in session.user)) {
        return null; // Handle case where session or subscriptions are not available
    }

    const { subscriptions } = session.user as CustomUser;

    if (!subscriptions) {
        return null;
    }

    // Filter subscriptions with "Server" in the name
    const serverSubscriptions = subscriptions.filter((sub) =>
        sub.name.toLowerCase().includes("server")
    );

    const handleSubscriptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSubscription(event.target.value); // Update selected subscription state
    };

    return (
        <div className=''>
            <label className="form-control bg-lightGreyBackground w-full max-w-xs">
            <div className="label">
                <span className="label-text text-lightModeText" style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif', fontWeight: 'normal' }}>
                Select Server Subscription
                </span>
            </div>
            <select
                className="select select-bordered bg-lightGreyBackground"
                style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'normal' }}
                onChange={handleSubscriptionChange}
                value={selectedSubscription || ''}
            >
                <option className='text-lightModeText' disabled value="">
                Select subscription
                </option>
                {serverSubscriptions.map((sub, index) => (
                <option className='text-lightModeText' key={index} value={sub.name} style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif', fontWeight: 'normal' }}>
                    {sub.name}
                </option>
                ))}
            </select>
            </label>
  
            {selectedSubscription && (
                <div className=''>
                    <WebhookInfo subscription_name={selectedSubscription}/>
                </div>
            )}
        </div>
    );
};

export default SelectSubscription;
