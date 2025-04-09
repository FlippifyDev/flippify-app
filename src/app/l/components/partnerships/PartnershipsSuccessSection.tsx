import React from 'react';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsSuccessSection = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Success Stories on the Horizon
            </h2>
            <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                As our partner network expands, we&apos;ll feature standout partners in case studies, highlighting how Flippify&apos;s AI tools have driven success across diverse business models. Join us early to be part of these inspiring stories and gain visibility in the e-commerce community.
            </p>
            <p className="text-left text-lightModeText font-semibold">
                Be among the first to showcase your success with Flippify—whether you&apos;re a reselling group leader or a software innovator!
            </p>
        </div>
    )
}

export default PartnershipsSuccessSection