'use client';
import Loading from '@/src/app/components/Loading';
import AnimationArrow from '@/src/app/components/AnimationArrow';
import Link from 'next/link';

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaDiscord } from 'react-icons/fa6';



const NavbarSignInWithDiscord = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (session) {
			if (session.user?.name) {
				router.push(`/u/${session.user.name}/dashboard`);
			} else {
				router.push(`/u/loading`);
			}
		}
	}, [session, router]);

	const handleSignIn = async () => {
		setIsLoading(true);
		signIn('discord');
		setIsLoading(false);
	};

	return (
		<div className='transition duration-100 hover:scale-105 rounded-btn p-1'>
			<a className="text-white group flex flex-row" onClick={handleSignIn}>
				<span className='text-md select-none'>Sign in</span>
				<span className='pt-[2px] pl-1'><AnimationArrow /></span>
			</a>
			{isLoading && (
				<div className="mt-4">
					<Loading />
				</div>
			)}
		</div>
	)
}

export default NavbarSignInWithDiscord;