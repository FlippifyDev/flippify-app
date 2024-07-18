"use client";

import UserAvatar from "./UserAvatar";
import { useSession } from 'next-auth/react';
import React from "react";

const UserProfile = () => {
	const { data: session } = useSession();

	return (
		<div className="flex items-center sm:space-x-3 bg-white p-1 rounded-2xl shadow-planCardShadow">
			{session?.user && (
				<div className="hidden sm:inline text-base font-medium pl-3 text-lightModeText">
					{session.user.name}
				</div>
			)}
			<UserAvatar />
		</div>
	);
};

export default UserProfile;