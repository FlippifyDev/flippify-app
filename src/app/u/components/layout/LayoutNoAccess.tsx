"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const LayoutNoAccess = () => {
	const router = useRouter();
	const { data: session } = useSession();

	useEffect(() => {
		if (session && session.user) {
			const username = session.user.username || 'unknown';
			router.push(`/u/${username}/dashboard`);
		}
	}, [session, router]);

	return (
		<div className="mt-10">
			<div className="flex flex-col text-center">
				<h1 className="text-4xl font-bold mb-4">Permission Denied</h1>
				<p className="text-lg">You do not have the required permissions to access this page.</p>
				<p className="text-lg">You will be redirect back to the dashboard shortly.</p>
			</div>
		</div>
	)
}

export default LayoutNoAccess
