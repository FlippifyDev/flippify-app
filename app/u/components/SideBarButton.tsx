'use client';

import React from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


interface SideBarButtonProps {
    text: string;
    redirect: string;
}


const SideBarButton: React.FC<SideBarButtonProps> = ({ text, redirect }) => {
    const { data: session } = useSession();
    const router = useRouter();

    const redirectUser = () => {
        if (session) {
            // Redirect to the username-specific URL or default redirect
            if (session.user?.name) {
                router.push(`/u/${session.user.name}/${redirect}`);
            } else {
                router.push(`/u/loading`);
            }
        }
    };

    return (
        <button className="hover:bg-violet-800 focus:bg-violet-900 " onClick={redirectUser}>{text}</button>
    );
}

export default SideBarButton
