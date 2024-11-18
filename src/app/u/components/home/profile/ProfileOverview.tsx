'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ProfileBillingPortalButton from "./ProfileBillingPortalButton";
import ProfileSupportButton from "./ProfileSupportButton";
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";
import { currencySymbols } from "@/src/config/currency-config";


const ProfileOverview = () => {
	const { data: session } = useSession();
	const currency = session?.user.currency as string;
	const currencySymbol = currencySymbols[currency];

	// Default avatar
	let avatar =
		"https://i.pinimg.com/originals/40/a4/59/40a4592d0e7f4dc067ec0cdc24e038b9.png";
	let username = "User";
	let email = "N/A";

	if (session) {
		if (session.user?.image) {
			avatar = session.user.image;
		}
		if (session.user?.name) {
			username = session.user.name;
		}
		if (session.user?.email) {
			email = session.user.email;
		}
	}

	return (
		<div className="w-full bg-white rounded-xl dark:bg-gray-800 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center">
			<div className="flex items-center">
				<Image
					alt="Avatar"
					src={avatar}
					width={100}
					height={100}
					className="rounded-full"
				/>
				<div className="ml-4">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						{username}
					</h2>
					<p className="text-gray-500 dark:text-gray-400">
						{email}
					</p>
					<div>
						<ProfileBillingPortalButton />
						<ProfileSupportButton />
					</div>
				</div>
			</div>

			{/* 
			<div className="flex flex-col md:flex-row gap-4 w-full font-semibold md:w-auto mt-4 md:mt-0 md:ml-auto">
				<LayoutSubscriptionWrapper requiredSubscriptions={['standard']}>
					<div className="stats shadow-md bg-white p-4 rounded-lg">
						<div className="stat">
							<div className="stat-title text-sm sm:text-base text-houseBlue">
								Subscription Status
							</div>
							<div className="stat-value font-bold text-xl sm:text-2xl text-black">
								Standard
							</div>
						</div>
					</div>
				</LayoutSubscriptionWrapper>
				<LayoutSubscriptionWrapper requiredSubscriptions={['pro']}>
					<div className="stats shadow-md bg-white p-4 rounded-lg">
						<div className="stat">
							<div className="stat-title text-sm sm:text-base text-houseBlue">
								Subscription Status
							</div>
							<div className="stat-value font-bold text-xl sm:text-2xl text-black">
								Pro
							</div>
						</div>
					</div>
				</LayoutSubscriptionWrapper>
				<LayoutSubscriptionWrapper requiredSubscriptions={['elite']}>
					<div className="stats shadow-md bg-white p-4 rounded-lg">
						<div className="stat">
							<div className="stat-title text-sm sm:text-base text-houseBlue">
								Subscription Status
							</div>
							<div className="stat-value font-bold text-xl sm:text-2xl text-black">
								Elite
							</div>
						</div>
					</div>
				</LayoutSubscriptionWrapper>
				<LayoutSubscriptionWrapper requiredSubscriptions={['!member']}>
					<div className="stats shadow-md bg-white p-4 rounded-lg">
						<div className="stat">
							<div className="stat-title text-sm sm:text-base text-houseBlue">
								Subscription Status
							</div>
							<div className="stat-value font-bold text-xl sm:text-2xl text-black">
								Not Active
							</div>
						</div>
					</div>
				</LayoutSubscriptionWrapper>
			</div>
			*/}
		</div>
	);
};

export default ProfileOverview;
