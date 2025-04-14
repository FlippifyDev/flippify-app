import React from 'react';
import { Inter } from 'next/font/google';
import Hero from '../dom/Hero';
import RoadmapFeatures from './RoadmapFeatures';
import RoadmapCTA from './RoadmapCTA';

const inter = Inter({ subsets: ['latin'] });

const Page = () => {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <Hero
                text={[
                    { text: "What's " },
                    { text: "happening ", isGradient: true },
                    { text: "behind the scenes?" }
                ]}
                description="We’re always building new ways to simplify eBay selling and save time, This is our roadmap letting you in on all our features that you can expect to see soon."
                image="/hero/roadmap.svg"
                imageAlt="Flippify Roadmap"
                imageContainerClassName="pb-20 scale-125"
            />

            <div className={`${inter.className} w-full mt-[10rem] xs:mt-[6rem] sm:mt-[8rem] md:mt-[10rem] lg2:mt-0 2xl:mt-[4rem]`}>
                <div className="py-20">
                    <RoadmapFeatures />
                </div>
                <RoadmapCTA />
            </div>
        </div>
    );
};

export default Page;