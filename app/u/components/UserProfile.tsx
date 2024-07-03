"use client";

import UserAvatar from "./UserAvatar";
import { useSession } from 'next-auth/react';
import React from "react";

const UserProfile = () => {
	const { data: session } = useSession();

	return (
		<div className="flex items-center space-x-3">
			{session?.user && (
				<div className="text-base font-medium pl-3">
					{session.user.name}
				</div>
			)}
			<UserAvatar />
		</div>
	);
};

export default UserProfile;