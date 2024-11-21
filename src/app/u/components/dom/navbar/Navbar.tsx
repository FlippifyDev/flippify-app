"use client";

import React, { useState, useEffect } from "react";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { useSession } from "next-auth/react";
import { getProcessedTitle } from "@/src/utils/extract-final-url-name";


const Navbar = () => {
	const { data: session } = useSession();
	const customerId = session?.user.customerId;
	const [title, setTitle] = useState(getProcessedTitle())

	// Fetch unread notifications count from Firebase
	useEffect(() => {
		setTitle(getProcessedTitle());
	}, [customerId]);


	return (
		<div className="h-full flex flex-row items-center">
			<div className="w-full pl-12 font-semibold text-lg">
				{title}
			</div>
			<div className="w-full flex justify-end pr-2">
				<NavbarProfileAvatar />
			</div>
		</div>
	);
};

export default Navbar;