"use client";

import React, { useState, useEffect } from "react";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { useSession } from "next-auth/react";
import { getProcessedTitle } from "@/utils/extract-final-url-name";
import NavbarAddListing from "./NavbarAddListing";

const Navbar = () => {
	const { data: session } = useSession();
	const customerId = session?.user.stripeCustomerId;
	const [title, setTitle] = useState(getProcessedTitle())

	// Fetch unread notifications count from Firebase
	useEffect(() => {
		setTitle(getProcessedTitle());
	}, [customerId]);


	return (
		<div className="h-full w-full flex flex-row items-center">
			<div className="w-full pl-4 sm:pl-12 font-semibold text-lg">
				{title.replace("And", "&")}
			</div>
            <div className="w-full flex justify-end pr-2 items-center">
                <div className="flex justify-end pr-2">
                    <NavbarAddListing />
                </div>
                <div className="flex justify-end pr-2">
                    <NavbarProfileAvatar />
                </div>
            </div>
		</div>
	);
};

export default Navbar;