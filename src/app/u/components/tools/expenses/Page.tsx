"use client"

// Local Imports
import OneTime from './OneTime';
import Subscriptions from './Subscriptions';
import LayoutSubscriptionWrapper from '../../layout/LayoutSubscriptionWrapper';

// External Imports
import React, { useEffect, useState, useRef } from 'react'
import { FaDatabase } from 'react-icons/fa';
import { ImLoop2 } from 'react-icons/im';
import { fetchSubscriptionMaxListings, fetchUserExpensesCount } from '@/utils/extract-user-data';
import { useSession } from 'next-auth/react';
import { subscriptionLimits } from '@/utils/constants';
import { RiLoopLeftLine } from 'react-icons/ri';
import { HiOutlineViewGridAdd, HiViewGridAdd } from 'react-icons/hi';
import Beta from '../../dom/ui/Beta';


const Page = () => {
    const { data: session } = useSession();

    const [initialTab, setInitialTab] = useState("one-time");

    // Determine initial tab based on the URL parameter
    useEffect(() => {
        const hash = window.location.hash;
        const tab = hash === "#subscriptions" ? "subscriptions" : hash === "#one-time" ? "one-time" : "one-time";
        setInitialTab(tab);
        setActiveTab(tab);
    }, []);

    const [activeTab, setActiveTab] = useState(initialTab);
    const [fadeIn, setFadeIn] = useState(true);
    const [isOpen, setIsOpen] = useState(false); // Manage dropdown state

    const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

    const { oneTime: totalOneTime, subscriptions: totalSubscriptions } = fetchUserExpensesCount(session?.user);
    const limits = session?.user.authentication?.subscribed ? subscriptionLimits[session?.user.authentication?.subscribed] : { oneTimeExpenses: 0, subscriptionExpenses: 0 }

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
                <div ref={dropdownRef} className="flex justify-between items-center px-2 py-4 w-full">
                    <div className='relative'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-transparent text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
                        >
                            <span className="ml-1">{activeTab === 'one-time' ? 'One Time' : 'Subscriptions'}</span>
                            <svg
                                className={`fill-current h-4 w-4 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </button>

                        {activeTab === "subscriptions" && (
                            <div className='absolute top-0 left-40'>
                                <Beta />
                            </div>
                        )}

                        {/* Dropdown menu, show/hide based on `isOpen` state */}
                        {isOpen && (
                            <ul className="absolute left-0 ml-6 z-10 w-48 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5">
                                <li>
                                    <a
                                        href="#one-time"
                                        onClick={() => handleTabChange('one-time')}
                                        className="grid grid-cols-12 items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-t"
                                    >
                                        <span className='col-span-2 flex justify-center'><FaDatabase /></span>
                                        <span className='col-span-10'>One Time</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#subscriptions"
                                        onClick={() => handleTabChange('subscriptions')}
                                        className="grid grid-cols-12 items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                                    >
                                        <span className='col-span-2 flex justify-center'><HiViewGridAdd className='text-lg' /></span>
                                        <span className='col-span-10'>Subscriptions</span>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </div>
                    <div className='px-4 ml-1'>
                        {activeTab === 'one-time' ?
                            <span className='text-xs text-gray-500'>You have {totalOneTime} one time expenses</span> :
                            <span className='text-xs text-gray-500'>You have {totalSubscriptions} subscriptions</span>
                        }
                    </div>
                </div>

                {/* Conditional Content Rendering with Fade Transition */}
                <div className={`transition-opacity duration-300 rounded-b-xl ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
                    {activeTab === "one-time" ? <OneTime /> : <Subscriptions />}
                </div>
            </main>
        </LayoutSubscriptionWrapper>
    )
}

export default Page;
