"use client";
import ManageServersSelectionWebhook from './ManageServersSelectionWebhook';
import fetchProductRegions from '@/src/services/mongodb/fetch-product-regions';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";


interface MyComponentProps {
	className?: string;
}

const ManagerServersSelectionList: React.FC<MyComponentProps> = () => {
	const { data: session } = useSession();
	const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
	const [regions, setRegions] = useState<string[]>([]);

	if (!session || !session.user || !("subscriptions" in session.user)) {
		return null;
	}

	const { subscriptions } = session.user;

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
		<div className='w-full max-w-xs'>
			<label className="form-control">
				<div className="label bg-transparent">
					<span className="label-text text-lightModeText font-semibold" style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
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
				<label className="form-control mt-4">
					<div className="label bg-transparent">
						<span className="label-text text-lightModeText font-semibold" style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif' }}>
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
					<ManageServersSelectionWebhook subscription_name={selectedSubscription} region={selectedRegion} />
				</div>
			)}
		</div>
	);
};

export default ManagerServersSelectionList;
