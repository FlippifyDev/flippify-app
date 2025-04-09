import React from 'react';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsFAQSection = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Got Questions?
            </h2>
            <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                Curious about commissions, beta timelines, or how to get started? Dive into our FAQs for clear answers tailored to potential partners like you.
            </p>
            <div className="space-y-4 sm:space-y-6 md:space-y-8 text-lightModeText font-semibold">
                <div>
                    <p className="font-bold text-left">How do I track my earnings?</p>
                    <p className="text-left">
                        Once partnerships launch, you&apos;ll get access to a dashboard to monitor your 40% commission in real-time.
                    </p>
                </div>
                <div>
                    <p className="font-bold text-left">Who can partner with Flippify?</p>
                    <p className="text-left">
                        We welcome a variety of partners, including reselling groups, eBay sellers, software providers, marketing agencies, and e-commerce consultants looking to grow revenue and streamline operations. Reselling groups on Discord, for instance, are a great example!
                    </p>
                </div>
                <div>
                    <p className="font-bold text-left">When will partnerships start?</p>
                    <p className="text-left">
                        We&apos;re in beta now, but we&apos;ll onboard partners soon—express interest to get in line!
                    </p>
                </div>
                <div>
                    <p className="font-bold text-left">What support do partners get?</p>
                    <p className="text-left">
                        You&apos;ll receive promo materials, priority support, and collaboration opportunities like challenges.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PartnershipsFAQSection