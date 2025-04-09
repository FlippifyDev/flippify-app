'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


const HomeGetAccess = () => {
    const router = useRouter();

    const [showAnimation, setShowAnimation] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowAnimation(false); // Disable animation after initial load
        }, 500); // Duration of your fade-in animation (400ms or adjust as needed)

        return () => clearTimeout(timer);
    }, []);

    return (
        <button
            className={`btn bg-houseHoverBlue rounded-lg mr-1 text-white hover:bg-houseBlue hover:shadow-lg hover:pb-[2px] border-none transform-duration-400 transition-duration-400 ${showAnimation ? "animate-fadeInPrimary" : ""}`}
            onClick={() => router.push('/l/login')}
        >
            Get Access Now
        </button>
    )
}

export default HomeGetAccess