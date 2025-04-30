"use client";

import NavbarAddOrder from "./NavbarAddOrder";
import NavbarAddListing from "./NavbarAddListing";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { getProcessedTitle } from "@/utils/extract-final-url-name";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface NavbarProps {
    handleDisplayModal: (display: boolean, type: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleDisplayModal }) => {
    const { data: session } = useSession();
    const customerId = session?.user.stripeCustomerId;
    const [title, setTitle] = useState(getProcessedTitle())
    const isConnected = session?.user.connectedAccounts?.ebay ? true : false;
    const subscribed = session?.user.authentication?.subscribed ? true: false;

    // Fetch unread notifications count from Firebase
    useEffect(() => {
        setTitle(getProcessedTitle());
    }, [customerId]);


    return (
        <div className="h-14 w-full flex flex-row items-center">
            <div className="w-full pl-4 sm:pl-12 font-semibold text-lg">
                {title.replace("And", "&")}
            </div>
            <div className="w-full flex justify-end pr-2 items-center">
                <div className="flex justify-end items-center mr-4 gap-4">
                    <NavbarAddListing handleDisplayModal={handleDisplayModal} isConnected={isConnected} isSubscribed={subscribed}/>
                    <NavbarAddOrder handleDisplayModal={handleDisplayModal} isConnected={isConnected} isSubscribed={subscribed} />
                </div>
                <div className="flex justify-end pr-2">
                    <NavbarProfileAvatar />
                </div>
            </div>
        </div>
    );
};

export default Navbar;