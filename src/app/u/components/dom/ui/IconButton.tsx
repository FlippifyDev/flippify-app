import React from 'react'
import LoadingAnimation from './LoadingAnimation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AnimationType } from './LoadingAnimation';

interface IconButtonProps {
    heading: string;
    animationType: AnimationType;
    subtitle: string;
    buttonText: string;
    redirect: string;
}

const IconButton: React.FC<IconButtonProps> = ({ heading, animationType, buttonText, subtitle, redirect }) => {
    const { data: session } = useSession();

    return (
        <div className="flex justify-center items-center flex-grow flex-col">
            <h1 className="text-lg font-semibold text-center mb-24">{heading}</h1>
            <LoadingAnimation text={subtitle} type={animationType} />
            <div className="w-full flex justify-center items-center mt-5">
                <Link href={`/u/${session?.user.username}/${redirect}`} className="btn border-0 bg-houseBlue bg-opacity-10 text-houseBlue hover:bg-houseHoverBlue hover:text-white transition duration-300 text-opacity-100 px-24 mx-auto rounded-lg shadow-lg">{buttonText}</Link>
            </div>
        </div>
    )
}

export default IconButton