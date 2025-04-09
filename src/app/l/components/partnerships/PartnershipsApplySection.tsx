import React from 'react';
import { Lato, Inter } from 'next/font/google';
import PartnershipsContactForm from './PartnershipsContactForm';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsApplySection = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12" id="contact-form">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Ready to Partner with Flippify?
            </h2>
            <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                We&apos;re excited to connect with a wide range of potential partners, from reselling groups and eBay sellers to software providers and consultants. While partnerships are on hold during our beta phase, we encourage you to express your interest now—we’ll reach out as soon as we’re ready to onboard new partners.
            </p>
            <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                Open a ticket or email{" "}
                <a href="mailto:partnerships@flippify.com" className="text-blue-400 hover:underline">
                    partnerships@flippify.com
                </a>{" "}
                to let us know you&apos;re interested. For example, reselling group leaders can get ahead by signing up early!
            </p>
            <PartnershipsContactForm />
        </div>
    )
}

export default PartnershipsApplySection