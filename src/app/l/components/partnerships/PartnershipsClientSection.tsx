import React from 'react'
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsClientDetails = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Empower Your Clients with Advanced Tools
            </h2>
            <p className="text-left text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Enhance your offerings by providing your clients with Flippify's AI-driven automation tools. These advanced solutions streamline listings, pricing, and inventory management, saving your clients time, reducing errors, and boosting their profits—making you a valuable partner in their success.
            </p>
        </div>
    )
}

export default PartnershipsClientDetails