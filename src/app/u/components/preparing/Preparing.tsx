"use client"

// Local Imports
import { jokes } from "@/app/components/loading_messages";
import LoadingAnimation from '../dom/ui/LoadingAnimation'

// External Imports
import React, { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Preparing = () => {
    const router = useRouter();

    const [joke, setJoke] = useState<string>("");
    
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const refreshedSession = await getSession();

            if (refreshedSession?.user?.subscriptions) {
                router.replace(`/u/${refreshedSession.user.username}/dashboard`);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [router]);

    // Function to get a random joke
    const getRandomJoke = () => {
        if (jokes && jokes.length > 0) {
            const randomIndex = Math.floor(Math.random() * jokes.length);
            return jokes[randomIndex];
        }
        return "";
    };

    // Set initial joke and update every 5 seconds
    useEffect(() => {
        setJoke(getRandomJoke());
        const jokeInterval = setInterval(() => {
            setJoke(getRandomJoke());
        }, 5000);

        return () => clearInterval(jokeInterval);
    }, []);


    return (
        <div className="w-full h-screen bg flex flex-col justify-center items-center text-center">
            <div className="mb-24">
                <p className="text-lg font-bold text-gray-700">Please do not close this tab or exit until complete.</p>
            </div>
            <div>
                <LoadingAnimation text={joke} type="stack-loader" />
            </div>
        </div>
    )
}

export default Preparing
