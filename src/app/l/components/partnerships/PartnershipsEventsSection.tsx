import React from 'react';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsEventsDetails = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Expand Your Reach with Flippify Challenges
            </h2>
            <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                Collaborate with Flippify to launch engaging social media challenges that captivate your audience and attract new clients, showcasing the power of our AI tools to drive results. Whether you&apos;re a reselling group, a marketing agency, or a software provider, these challenges offer a unique way to demonstrate value and grow your business.
            </p>
            <p className="text-left text-lightModeText font-semibold">
                Partner with us to host challenges—like &apos;Who can make the most profit in 30 days?&apos;—where we&apos;ll promote your business, select participants, and track results using our tools. It&apos;s a win-win: your audience sees the benefits of automation, and you gain exposure and new sign-ups. For instance, Discord reselling groups can showcase how their members thrive with Flippify.
            </p>
        </div>
    )
}

export default PartnershipsEventsDetails