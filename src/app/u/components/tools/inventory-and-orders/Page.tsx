"use client"

// Local Imports


import Orders from './Orders';
import Inventory from './Inventory';
import { subscriptionLimits } from '@/utils/constants';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';
import { fetchUserInventoryAndOrdersCount } from '@/utils/extract-user-data';

// External Imports
import React, { useEffect, useState, useRef } from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { FaBox } from "react-icons/fa";
import { orderFilters } from './UpdateTableField';


const Page = () => {
    const { data: session } = useSession();

    const [initialTab, setInitialTab] = useState("inventory");

    const [orderFilter, setOrderFilter] = useState<(typeof orderFilters)[number]>("All");

    // Determine initial tab based on the URL parameter
    useEffect(() => {
        const hash = window.location.hash;
        const tab = hash === "#orders" ? "orders" : hash === "#inventory" ? "inventory" : "inventory";
        setInitialTab(tab);
        setActiveTab(tab);
    }, []);

    const [activeTab, setActiveTab] = useState(initialTab);
    const [fadeIn, setFadeIn] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Manage dropdown state

    const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

    const { automaticListings, automaticOrders, manualListings, manualOrders } = fetchUserInventoryAndOrdersCount(session?.user);
    const limits = session?.user.authentication?.subscribed ? subscriptionLimits[session?.user.authentication?.subscribed] : { automatic: 0, manual: 0 }
    const totalLimit = limits.automatic + limits.manual;

    useEffect(() => {
        // Close dropdown if clicked outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    // Function to handle tab switching
    const handleTabChange = (tab: string) => {
        setFadeIn(false);
        setTimeout(() => {
            setFadeIn(true);
            setActiveTab(tab);
        }, 300);
        setIsOpen(false);
    };

    return (
        <LayoutSubscriptionWrapper anySubscriptions={["admin", "member"]}>
            <main className="bg-white shadow rounded-xl">
                {/* Dropdown for Tab Selection */}
                <div ref={dropdownRef} className="flex justify-between items-center px-2 py-4">
                    <div className='relative'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-transparent text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
                        >
                            <span className="ml-1">{activeTab === 'inventory' ? 'Inventory' : 'Orders'}</span>
                            <svg
                                className={`fill-current h-4 w-4 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </button>

                        {/* Dropdown menu, show/hide based on `isOpen` state */}
                        {isOpen && (
                            <ul className="absolute left-0 ml-6 z-10 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                                <li>
                                    <a
                                        href="#inventory"
                                        onClick={() => handleTabChange('inventory')}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-t"
                                    >
                                        <span><FaBox /> </span>
                                        <span>Inventory</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#orders"
                                        onClick={() => handleTabChange('orders')}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                    >
                                        <span><FaShoppingCart /></span>
                                        <span>Orders</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>

                    <div className='flex flex-row items-center'>
                        {activeTab === 'orders' && (
                            <div className='text-xs flex flex-row'>
                            {orderFilters.map((filter, index) => (
                                <button
                                    key={filter}
                                    onClick={() => setOrderFilter(filter)}
                                    className={`px-3 py-1 font-semibold transition-all border duration-150 ${orderFilter === filter ? "text-houseBlue bg-gray-200" : "bg-gray-100 text-gray-700 hover:bg-gray-100"} ${index === 0 ? "rounded-l" : ""} ${index === orderFilters.length - 1 ? "rounded-r": ""}`}
                                    >
                                    {filter}
                                </button>
                            ))}
                        </div>
                        )}
                        <div className='px-4 ml-1'>
                            {activeTab === 'inventory' ?
                                <span className='text-xs text-gray-500'>You have {automaticListings + manualListings} / {totalLimit} listings</span> :
                                <span className='text-xs text-gray-500'>You have {automaticOrders + manualOrders} / {totalLimit} orders</span>
                            }
                        </div>
                    </div>
                </div>

                {/* Conditional Content Rendering with Fade Transition */}
                <div className={`transition-opacity duration-300 rounded-b-xl ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                    {activeTab === "inventory" ? <Inventory /> : <Orders filter={orderFilter} />}
                </div>
            </main>
        </LayoutSubscriptionWrapper>
    )
}

export default Page;
