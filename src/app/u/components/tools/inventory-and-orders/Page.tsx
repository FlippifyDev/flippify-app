"use client"

// Local Imports

import Orders from './Orders';
import Inventory from './Inventory';
import IconButton from '../../dom/ui/IconButton';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';

// External Imports
import React, { useEffect, useState, useRef } from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import { useSession } from "next-auth/react";
import { FaBox } from "react-icons/fa";


const Page = () => {
    const [initialTab, setInitialTab] = useState("inventory");
    const { data: session } = useSession();

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
            <main className="bg-white rounded-xl">
                {/* Dropdown for Tab Selection */}
                <div ref={dropdownRef} className="relative inline-block text-left px-2 py-4">
                    <div>
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
                    </div>

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

                {/* Conditional Content Rendering with Fade Transition */}
                <div className={`transition-opacity duration-300 rounded-b-xl ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                    {activeTab === "inventory" ? <Inventory /> : <Orders />}
                </div>
            </main>
        </LayoutSubscriptionWrapper>
    )
}

export default Page;
