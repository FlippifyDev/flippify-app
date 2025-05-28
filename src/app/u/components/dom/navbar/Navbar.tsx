"use client";

// Local Imports
import NabarItem from "./NabarItem";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { getProcessedTitle } from "@/utils/extract-final-url-name";

// External Imports
import React, { useState, useEffect } from "react";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { RiFolderUploadLine } from "react-icons/ri";
import { TbShoppingBagPlus } from "react-icons/tb";
import { BsDatabaseAdd } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { BiBookAdd } from "react-icons/bi";

interface NavbarProps {
    handleDisplayModal: (display: boolean, type: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleDisplayModal }) => {
    const { data: session } = useSession();
    const customerId = session?.user.stripeCustomerId;
    const [title, setTitle] = useState(getProcessedTitle())
    const isSubscribed = session?.user.authentication?.subscribed ? true : false;

    // Fetch unread notifications count from Firebase
    useEffect(() => {
        setTitle(getProcessedTitle());
    }, [customerId]);

    function handleOnClick(model: string) {
        if (!isSubscribed) return;
        handleDisplayModal(true, model);
    }

    return (
        <div className="h-14 w-full flex flex-row items-center">
            <div className="hidden sm:block w-full pl-4 sm:pl-12 font-semibold text-base text-white">
                {title.replace("And", "&")}
            </div>
            <div className="w-full flex justify-end pr-2 items-center">
                <div className="flex justify-end items-center mr-4 gap-1 text-offWhite text-[33px]">
                    <NabarItem
                        title="Add One Time Expenese"
                        isSubscribed={isSubscribed}
                        icon={<BsDatabaseAdd className="p-2 hover:bg-muted/10 rounded" onClick={() => handleOnClick("add-one-time-expense")} />}
                    />
                    <NabarItem
                        title="Add Subscription Expenese"
                        isSubscribed={isSubscribed}
                        icon={<HiOutlineViewGridAdd className="p-2 hover:bg-muted/10 rounded" onClick={() => handleOnClick("add-subscription-expense")} />}
                    />
                    <div className="h-6 mx-2 border-r border-uiBorder"></div>
                    <NabarItem
                        title="Upload Sales"
                        isSubscribed={isSubscribed}
                        icon={<RiFolderUploadLine className="p-2 hover:bg-muted/10 rounded" onClick={() => handleOnClick("upload-orders")} />}
                    />
                    <NabarItem
                        title="Add To Inventory"
                        isSubscribed={isSubscribed}
                        icon={<TbShoppingBagPlus className="p-2 hover:bg-muted/10 rounded" onClick={() => handleOnClick("add-listing")} />}
                    />
                    <NabarItem
                        title="Add To Orders"
                        isSubscribed={isSubscribed}
                        icon={<BiBookAdd className="p-2 hover:bg-muted/10 rounded" onClick={() => handleOnClick("add-order")} />}
                    />
                </div>
                <div className="flex justify-end pr-2">
                    <NavbarProfileAvatar />
                </div>
            </div>
        </div>
    );
};

export default Navbar;