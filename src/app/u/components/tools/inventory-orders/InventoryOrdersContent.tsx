"use client"

// External Imports
import React, { useEffect, useState, ChangeEvent } from 'react'
import { useSession } from 'next-auth/react';

// Local Imports
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import OrdersContent from './OrdersContent';
import InventoryContent from './InventoryContent';
import { refreshEbayToken } from '@/src/services/ebay/refresh-token';
import { revalidatePath } from 'next/cache';
import "@/src/styles/inventory-orders-tabs.css"

const InventoryOrdersContent = () => {
	const { data: session } = useSession();
	const [activeTab, setActiveTab] = useState("inventory");
	const [fadeIn, setFadeIn] = useState(true);

	const customerId = session?.user.customerId;
	const ebayTokenExpiry = session?.user.ebay?.ebayTokenExpiry;
	if (!customerId || !ebayTokenExpiry) {
		return <div>Loading...</div>;
	}

	useEffect(() => {
		const checkRefreshToken = async () => {
			// Check if the token needs to be refreshed
			if (Date.now() >= ebayTokenExpiry) {
				await refreshEbayToken(customerId);
			}
		}

		checkRefreshToken()
	}, [session, customerId])


	// Function to handle tab switching
	const handleTabChange = (event: ChangeEvent<HTMLInputElement>) => {
		setFadeIn(false);
		setTimeout(() => {
			setActiveTab(event.target.value);
			setFadeIn(true);
		}, 300);
	};


	return (
		<LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
			{/* Tab Switcher */}
			<div role="tablist" className="tabs flex text-center justify-center mt-4 rounded-lg h-12">
				<label className={`tab tab-lg text-[16px] relative overflow-hidden h-full ${activeTab === 'inventory' ? 'tab-active' : ''}`}>
					<input
						type="radio"
						name="tabs"
						value="inventory"
						checked={activeTab === 'inventory'}
						onChange={handleTabChange}
						className="hidden"
					/>
					{/* Apply the transition class only when the tab is active */}
					<span className={`font-semibold text-gray-600 ${activeTab === 'inventory' ? 'animate-fillText' : ''}`}>Inventory</span>
				</label>
				<label className={`tab tab-lg text-[16px] relative overflow-hidden h-full ${activeTab === 'orders' ? 'tab-active' : ''}`}>
					<input
						type="radio"
						name="tabs"
						value="orders"
						checked={activeTab === 'orders'}
						onChange={handleTabChange}
						className="hidden"
					/>
					{/* Apply the transition class only when the tab is active */}
					<span className={`font-semibold text-gray-600 ${activeTab === 'orders' ? 'animate-fillText' : ''}`}>Orders</span>
				</label>
			</div>

			{/* Conditional Content Rendering with Fade Transition */}
			<div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
				{activeTab === "inventory" ? <InventoryContent /> : <OrdersContent />}
			</div>
		</LayoutSubscriptionWrapper>
	)
}

export default InventoryOrdersContent;
