'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


const HomeGetAccess = () => {
    const router = useRouter();

    const [showAnimation, setShowAnimation] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimation(false); 
        }, 500); 

        return () => clearTimeout(timer);
    }, []);

    return (
        <button
            className={`btn bg-houseHoverBlue rounded-lg text-white hover:bg-houseBlue hover:shadow-lg hover:pb-[2px] border-none transform duration-200 ${showAnimation ? "animate-fadeInPrimary" : ""}`}
            onClick={() => router.push('/l/sign-up')}
        >
            Get Access Now
        </button>
    )
}

export default HomeGetAccess