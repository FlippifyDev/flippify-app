'use client';

import React from "react";
import { useSession } from "next-auth/react";
import ProfileBillingPortalButton from "./ProfileBillingPortalButton";
import ProfileSupportButton from "./ProfileSupportButton";
import { currencySymbols } from "@/src/config/currency-config";
import ImageModal from '@/src/app/components/ImageModal';


const ProfileOverview = () => {
	const { data: session } = useSession();
	const currency = session?.user.currency as string;
	const currencySymbol = currencySymbols[currency];

	// Default avatar
	let avatar = "https://i.imgur.com/pXG2DV3.jpeg";
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
				<ImageModal src={avatar} alt={"Avatar"} width={80} height={80} className="rounded-full" />
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
		</div>
	);
};

export default ProfileOverview;
