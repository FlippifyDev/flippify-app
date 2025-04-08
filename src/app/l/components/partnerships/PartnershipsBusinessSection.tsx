import React from 'react';
import { Lato, Inter } from 'next/font/google';
import PartnershipsBusinessCard from './PartnershipsBusinessCard';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const PartnershipsBusinessDetails = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Boost Your Business with Flippify
            </h2>
            <p className="w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Partnering with Flippify unlocks a 40% revenue share, growth through promotions, and a real-time dashboard to track your success—all tailored to elevate your business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                <PartnershipsBusinessCard
                    title="Earn Extra Income"
                    description="Unlock a new revenue stream with Flippify’s generous commission structure:  
                    - Earn 40% on every sale via your coupon codes.  
                    - Steady income as your audience grows.  
                    - No cap on your earning potential."
                    disclaimer={null}
                    image="/RevenueStreamBanner.png"
                />
                <PartnershipsBusinessCard
                    title="Grow Your Audience"
                    description="Expand your reach with Flippify’s promotional support:  
                    - Official partner label for credibility.  
                    - Co-branded social media challenges to attract members.  
                    - We promote your business to our audience."
                    disclaimer={null}
                    image="/AudienceGrowthBanner.png"
                />
                <PartnershipsBusinessCard
                    title="Track Your Success"
                    description="Stay in control with a dedicated partner dashboard:  
                    - Real-time tracking of commissions.  
                    - Monitor coupon code usage.  
                    - Insights to optimize your promotions."
                    disclaimer="Dashboard coming soon after beta."
                    image="/EarningsDashboardBanner.png"
                />
                <PartnershipsBusinessCard
                    title="Gain Early Recognition"
                    description="Be a trailblazer with Flippify’s early partner perks:  
                    - Featured in future case studies.  
                    - Boost your brand’s visibility.  
                    - Showcase your success to our community."
                    disclaimer={null}
                    image="/EarlyPartnerBanner.png"
                />
            </div>
        </div>
    );
};

export default PartnershipsBusinessDetails;