'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { FaSignOutAlt } from "react-icons/fa";
import SidebarButton from './Button';


interface SidebarSignOutButtonProps {
	isSidebarOpen: boolean;
}


const SidebarSignOutButton:React.FC<SidebarSignOutButtonProps> = ({ isSidebarOpen }) => {
	const { data: session } = useSession();
	const router = useRouter();

	// Handle redirect after session becomes null
	useEffect(() => {
		if (!session) {
			router.push(`/l/home`);
		}
	}, [session, router]);

	const handleSignOut = () => {
		signOut({
			callbackUrl: '/l/home', // Redirect to landing page after sign out
		});
	};

	return (
		<SidebarButton text="Sign Out" isSidebarOpen={isSidebarOpen} symbol={<FaSignOutAlt className='text-lg'/>} onClick={handleSignOut} />
	);
};

export default SidebarSignOutButton;
