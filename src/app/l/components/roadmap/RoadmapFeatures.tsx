import React from 'react';
import { Inter } from 'next/font/google';
import RoadmapFeatureCard from './RoadmapFeatureCard';

const inter = Inter({ subsets: ['latin'] });

const RoadmapFeatures = () => {
    const features = [
        {
            title: "Seller-Buyer Communication x AI",
            description: "Say hello to in-house seller-buyer communications allowing you to truly stay in one place for all your needs, with the addition of AI assistance for frequent questions to automate responses to maintain excellent customer service.",
            bulletPoints: [
                "Automatic AI-powered responses to common customer questions",
                "Automated order updates and shipping notifications",
                "Customizable templates to match your store's tone",
                "Seamless integration with eBay messaging system"
            ],
            image: "/roadmap/RoadmapAICommunication.jpg",
        },
        {
            title: "Automated Listings Using AI",
            description: "By far our most anticipated tool - let AI handle the listing process for you with our smart automation tools to revolutionize your listing process.",
            bulletPoints: [
                "Use our browser extension for one-click listing creation or import a product link to our listing manager, confirm the details and Flippify will handle the rest.",
                "Fully automated listings through data scraping and AI optimization: Product Image, Descriptions, Pricing, Shipping Details and more.",
                "Automatic price optimization and management with 24/7 competitor analysis ensuring maximum profit and fastest turnover."
            ],
            image: "/roadmap/RoadmapAutomatedListings.jpg",
        },
        {
            title: "Expanded Financial Reporting",
            description: "Comprehensive financial tools to help you understand and optimize your business performance.",
            bulletPoints: [
                "Detailed tax reports for easy compliance",
                "Profit margin analysis by product category",
                "24/7 Automated competitor analysis and price optimization pn products",
                "Detailed exportable reports for accounting software and PDF generation"
            ],
            image: "/roadmap/RoadmapFinancialReports.jpg",
        },
        {
            title: "Multi-Store Support",
            description: "Manage all your eBay stores from a single powerful dashboard.",
            bulletPoints: [
                "Consolidated metrics across multiple stores",
                "Seamless switching between accounts",
                "Cross-store inventory management",
                "Unified customer communication system"
            ],
            image: "/roadmap/RoadmapMultiAccountSupport.jpg",
        }
    ];

    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Upcoming Features
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                We're constantly working to improve Flippify and add new features that will make managing your eBay store even easier. Here's a sneak peek at what's coming next on our roadmap.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                {features.map((feature, index) => (
                    <RoadmapFeatureCard
                        key={index}
                        title={feature.title}
                        description={feature.description}
                        bulletPoints={feature.bulletPoints}
                        image={feature.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default RoadmapFeatures;