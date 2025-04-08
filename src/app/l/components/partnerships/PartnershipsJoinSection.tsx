import React from 'react';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsJoinDetails = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                How to Join the Flippify Partner Network
            </h2>
            <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                Joining the Flippify Partner Network is straightforward: express your interest, get approved post-beta, receive your unique coupon codes, promote Flippify to your audience, and earn a 40% commission on every sale. Our onboarding process is designed to fit seamlessly into your business model, whether you're leading a community or offering specialized services.
            </p>
            <ol className="list-decimal list-inside text-left text-lightModeText space-y-4">
                <li>
                    <strong>Express Interest</strong>: Open a ticket or email partnerships@flippify.com to tell us about your business.
                </li>
                <li>
                    <strong>Get Approved</strong>: After our beta phase, we'll review your application and onboard you as a partner.
                </li>
                <li>
                    <strong>Receive Your Codes</strong>: Get exclusive coupon codes to distribute to your audience.
                </li>
                <li>
                    <strong>Promote Flippify</strong>: Share the codes and our tools with your clients or community using provided materials.
                </li>
                <li>
                    <strong>Earn Revenue</strong>: Collect 40% of each sale as your audience uses their codes to succeed.
                </li>
            </ol>
        </div>
    )
}

export default PartnershipsJoinDetails