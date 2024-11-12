"use client";

import React, { useState, useEffect } from "react";
import NavbarProfileAvatar from "./NavbarProfileAvatar";
import { useSession } from "next-auth/react";
import { ref, onValue } from "firebase/database";
import { database } from '@/src/lib/firebase/client'; // Firebase config
import { Lato } from 'next/font/google';
import Link from 'next/link';
import "@/src/styles/user-navbar.css"

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });

const Navbar = () => {
	const { data: session } = useSession();
	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch unread notifications count from Firebase
	useEffect(() => {
		if (!session?.user?.customerId) return;

		const sanitizedCustomerId = session.user.customerId.replace(/[.#$[\]]/g, '_');
		const notificationsRef = ref(database, 'notifications');

		const unsubscribe = onValue(notificationsRef, (snapshot) => {
			let unreadNotifications = 0;
			snapshot.forEach((childSnapshot) => {
				const notification = childSnapshot.val();
				if (!notification.readBy || !notification.readBy[sanitizedCustomerId]) {
					unreadNotifications++;
				}
			});
			setUnreadCount(unreadNotifications);  // Update unread count
		});

		return () => unsubscribe();
	}, [session?.user?.customerId]);

	return (
		<div className="navbar fixed w-full top-0 left-0 grid grid-cols-12 shadow-planCardShadow bg-white md:px-4 py-2 z-40">
			<div className="flex items-center xl:hidden col-span-2">
				<label
					htmlFor="my-drawer"
					className="btn btn-ghost text-lightModeText text-2xl bg-transparent border-transparent hover:bg-transparent hover:border-transparent hover:scale-125 relative"
				>
					{/* Drawer icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M4 6h16M4 12h16M4 18h7" />
					</svg>
					{/* Unread notification badge */}
					{unreadCount > 0 && (
						<span className="absolute top-[20px] right-[17px] text-[0.5rem] text-white bg-houseBlue rounded-full h-3 w-3 flex items-center justify-center">
							{unreadCount}
						</span>
					)}
				</label>
			</div>
			<div className="col-span-8 ml-2 mb-1 xl:col-span-4 flex justify-center xl:justify-start items-center">
				<Link href="/" className={`text-lightModeText text-4xl ${lato.className}`}>
					flippify
				</Link>
			</div>
			<div className="flex items-center justify-end col-span-2 xl:col-span-8">
				<div className="flex items-center bg-transparent p-1">
					<NavbarProfileAvatar />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
