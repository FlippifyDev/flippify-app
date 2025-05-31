import React from 'react';
import { Lato, Inter } from 'next/font/google';
import PartnershipsBusinessCard from './PartnershipsBusinessCard';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const PartnershipsBusinessDetails = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Empower your business with Flippify
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Partner with Flippify to equip your clients with state-of-the-art automation software that revolutionizes their operations. Earn 30% revenue share, gain early partner recognition, and grow through challenges connecting our members to your business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                <PartnershipsBusinessCard
                    title="Lucrative Revenue Share"
                    subtitle="Unlock a new revenue stream with Flippify&apos;s generous commission structure"
                    bulletPoints={[
                        "Earn 30% on every sale via your coupon codes",
                        "Steady income as your audience grows",
                        "No cap on your earning potential"
                    ]}
                    disclaimer={null}
                    image="/PartnershipsExtraIncome.jpg"
                />
                <PartnershipsBusinessCard
                    title="Grow Your Audience"
                    subtitle="Expand your reach with Flippify&apos;s promotional support"
                    bulletPoints={[
                        "Official partner label for credibility",
                        "Co-branded social media challenges to attract members",
                        "We promote your business to our audience"
                    ]}
                    disclaimer={null}
                    image="/PartnershipsAudienceGrowth.jpg"
                />
                <PartnershipsBusinessCard
                    title="Track Your Success"
                    subtitle="Stay in control with a dedicated partner dashboard"
                    bulletPoints={[
                        "Real-time tracking of commissions",
                        "Monitor coupon code usage",
                        "Insights to optimize your promotions"
                    ]}
                    disclaimer={null}
                    image="/PartnershipsTrackSuccess.jpg"
                />
                <PartnershipsBusinessCard
                    title="Early Partner Recognition"
                    subtitle="Be a trailblazer with Flippify&apos;s early partner perks"
                    bulletPoints={[
                        "Featured in future case studies",
                        "Boost your brand's visibility",
                        "Showcase your success to our community"
                    ]}
                    disclaimer={null}
                    image="/PartnershipsEarlyRecognition.jpg"
                />
            </div>
        </div>
    );
};

export default PartnershipsBusinessDetails;