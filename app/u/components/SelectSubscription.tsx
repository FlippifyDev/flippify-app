"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import WebhookInfo from './WebhookInfo';
import fetchProductRegions from '@/app/api/fetchProductRegions';

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
    const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [regions, setRegions] = useState<string[]>([]);

    if (!session || !session.user || !("subscriptions" in session.user)) {
        return null;
    }

    const { subscriptions } = session.user as CustomUser;

    if (!subscriptions) {
        return null;
    }

    const serverSubscriptions = subscriptions.filter((sub) =>
        sub.name.toLowerCase().includes("server")
    );

    const handleSubscriptionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const subscriptionName = event.target.value;
        setSelectedSubscription(subscriptionName);
        const fetchedRegions = await fetchProductRegions(subscriptionName);
        setRegions(fetchedRegions);
    };

    const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRegion(event.target.value);
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
                    className="select select-bordered bg-white"
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
                <label className="form-control bg-lightGreyBackground w-full max-w-xs mt-4">
                    <div className="label">
                        <span className="label-text text-lightModeText" style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif', fontWeight: 'normal' }}>
                            Select Region
                        </span>
                    </div>
                    <select
                        className="select select-bordered bg-white"
                        style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', fontWeight: 'normal' }}
                        onChange={handleRegionChange}
                        value={selectedRegion || ''}
                    >
                        <option className='text-lightModeText' disabled value="">
                            Select region
                        </option>
                        {regions.map((region, index) => (
                            <option className='text-lightModeText' key={index} value={region} style={{ fontSize: '14px', fontFamily: 'Arial, sans-serif', fontWeight: 'normal' }}>
                                {region.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </label>
            )}

            {selectedSubscription && selectedRegion && (
                <div className='mt-4'>
                    <WebhookInfo subscription_name={selectedSubscription} region={selectedRegion} />
                </div>
            )}
        </div>
    );
};

export default SelectSubscription;
