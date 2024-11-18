"use client";

import React, { useState, useEffect } from "react";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { useSession } from "next-auth/react";
import { ref, get } from "firebase/database";
import { database } from '@/src/lib/firebase/client';
import { getProcessedTitle } from "@/src/utils/extract-final-url-name";


const Navbar = () => {
	const { data: session } = useSession();
	const [unreadCount, setUnreadCount] = useState(0);
	const customerId = session?.user.customerId;
	const [title, setTitle] = useState(getProcessedTitle())

	// Fetch unread notifications count from Firebase
	useEffect(() => {
		setTitle(getProcessedTitle());
		if (!customerId) return;

		const sanitizedCustomerId = customerId.replace(/[.#$[\]]/g, '_');
		const notificationsRef = ref(database, 'notifications');

		const fetchUnreadNotifications = async () => {
			try {
				const snapshot = await get(notificationsRef);  // Get data once using 'get'
				if (snapshot.exists()) {
					let unreadNotifications = 0;
					snapshot.forEach((childSnapshot) => {
						const notification = childSnapshot.val();
						if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
							unreadNotifications++;
						}
					});
					setUnreadCount(unreadNotifications);  // Update unread count
				} else {
					console.log("No notifications data available.");
				}
			} catch (error) {
				console.error("Error fetching notifications:", error);
			}
		};

		fetchUnreadNotifications();  // Call the function to fetch notifications

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