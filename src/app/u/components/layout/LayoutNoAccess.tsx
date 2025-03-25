"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingAnimation from '../dom/ui/LoadingAnimation';

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
        <LoadingAnimation text="Permission Denied. You will be redirect back to the dashboard shortly." type="hover-box"/>
	)
}

export default LayoutNoAccess
