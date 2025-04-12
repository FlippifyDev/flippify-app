import React from 'react';
import { Lato, Inter } from 'next/font/google';
import Image from 'next/image';
import HomeGetAccess from '../home/HomeGetAccess';
import Hero from '../dom/Hero';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const FinancialHubContent = () => {
    return (
        <div className='financial-hub-container'>
            <div>
                <Hero
                    text={[{ text: "Unlock Financial Clarity with" }, { text: "Flippify's", isGradient: true }, { text: "Financial Automation" }]}
                    description="Automatically track finances with Flippify's expert accounting software—built for eBay sellers. Integrated with our Inventory & Order Management systems, we use advanced algorithms to deliver clear insights. Export CSVs in one click and scale with confidence."
                    button={<HomeGetAccess />}
                    image="/hero/accountingSoftware.svg"
                    imageAlt="Flippify Financial Hub"
                    titleClassName="lg:w-3/5"
                />
            </div>

            <div className="flex flex-col mt-16 sm:mt-20 md:mt-24 lg:mt-[200px] xl:mt-[280px]">
                {/* Why Choose Flippify's Financial Hub? Section */}
                <div className="py-20">
                    <FinancialHubOverview />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Key Features Section */}
                <div className="py-20">
                    <FinancialHubFeatures />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* How It Works Section */}
                <div className="py-20">
                    <FinancialHubHowItWorks />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Benefits Section */}
                <div className="py-20">
                    <FinancialHubBenefits />
                </div>
                <div className="w-full border-b-2 border-gray-300 border-dashed"></div>

                {/* Call to Action Section */}
                <div className="pt-20">
                    <FinancialHubCTA />
                </div>
            </div>

            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[150px] xl:pt-[180px]" />
        </div>
    );
};

// Section 1: Why Choose Flippify's Financial Hub?
const FinancialHubOverview = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Your Financial Command Center for eBay Success
            </h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                {/* Left side content */}
                <div className="w-full md:w-3/5">
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Flippify's Financial Hub is designed specifically for eBay sellers, integrating seamlessly with our Inventory & Order Management systems. Every item logged—whether synced automatically from your sales or entered manually—flows through advanced algorithms to deliver real-time financial insights. From tiny fees to total revenue, everything is covered in a clean, intuitive dashboard.
                    </p>

                    <div className="relative p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Why eBay Sellers Choose Us
                        </h3>
                        <ul className="space-y-2 text-lg">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Seamless integration with inventory and orders</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Automation saves time and reduces errors</span>
                            </li>
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Tailored for eBay-specific financial needs</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right side image placeholder */}
                <div className="w-full md:w-2/5 flex items-center justify-center">
                    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                        <Image
                            src="/AccountingSoftware.png"
                            alt="Financial Dashboard Preview"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Section 2: Key Features
const FinancialHubFeatures = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Key Features
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Our comprehensive Financial Hub provides all the tools you need to track, manage, and optimize your eBay business finances.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Feature 1 - Automated Financial Tracking */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Automated Financial Tracking
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Say goodbye to manual bookkeeping. The Financial Hub automatically logs every transaction from your inventory and order systems, processing fees, revenue, costs, ROI, average profit per sale, and Net Profit Margin (NPM) per sale with precision.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 2 - Comprehensive Reporting */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-b-2 border-dashed border-gray-300 hidden md:block"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Comprehensive Reporting
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Generate detailed financial reports instantly—track revenue, margins, and monthly sales comparisons across custom categories you define. Gain insights into your eBay business with beautifully laid-out data.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 3 - Tax Compliance Made Simple */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 right-0 h-full w-0 sm:w-px md:w-0.5 border-r-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 right-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Tax Compliance Made Simple
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Stay tax-compliant effortlessly with automated tax calculations tailored for eBay sellers. Export CSVs in one click to simplify filings and audits as your business grows.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 4 - Customizable Categories */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10">
                    <div className="absolute top-0 left-0 h-full w-0 sm:w-px md:w-0.5 border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                    <div className="absolute top-0 left-0 w-full h-0 sm:h-px md:h-0.5 border-t-2 border-dashed border-gray-300"></div>

                    <div className="flex items-start mb-4">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Customizable Categories
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Organize your inventory into custom categories (e.g., 'Apparel,' 'Tech') when adding products. Set purchase costs and watch financials update automatically across your reports.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 5 - Stock and Expense Management */}
                <div className="relative min-h-64 px-2 py-8 md:py-10 md:px-10 md:col-span-2">
                    <div className="flex items-start mb-4 justify-center">
                        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-houseBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                                Stock and Expense Management
                            </h3>
                            <p className="text-left text-lightModeText text-lg mb-4">
                                Track stock levels, expenses, and profitability in one centralized hub. Monitor costs and availability alongside your financial data for smarter inventory decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Section 3: How It Works
const FinancialHubHowItWorks = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                From eBay Sales to Financial Insights in Four Steps
            </h2>
            <p className="w-full md:w-3/5 text-left text-lg text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                Our streamlined process makes financial management simple and effective for eBay sellers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
                {/* Step 1 */}
                <div className="bg-gray-50 p-6 rounded-3xl shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="bg-houseBlue rounded-full h-10 w-10 flex items-center justify-center text-white font-bold text-xl mr-3">
                            1
                        </div>
                        <h3 className={`${inter.className} text-xl font-bold text-lightModeText`}>
                            Connect Your eBay Store
                        </h3>
                    </div>
                    <p className="text-lightModeText">
                        Link your eBay account to sync orders and inventory automatically.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="bg-gray-50 p-6 rounded-3xl shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="bg-houseBlue rounded-full h-10 w-10 flex items-center justify-center text-white font-bold text-xl mr-3">
                            2
                        </div>
                        <h3 className={`${inter.className} text-xl font-bold text-lightModeText`}>
                            Categorize Products
                        </h3>
                    </div>
                    <p className="text-lightModeText">
                        Set up custom categories and input purchase costs in the Inventory Management system.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="bg-gray-50 p-6 rounded-3xl shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="bg-houseBlue rounded-full h-10 w-10 flex items-center justify-center text-white font-bold text-xl mr-3">
                            3
                        </div>
                        <h3 className={`${inter.className} text-xl font-bold text-lightModeText`}>
                            Automate Analysis
                        </h3>
                    </div>
                    <p className="text-lightModeText">
                        Our algorithms process every sale, fee, and expense to generate real-time financial reports.
                    </p>
                </div>

                {/* Step 4 */}
                <div className="bg-gray-50 p-6 rounded-3xl shadow-md">
                    <div className="flex items-center mb-4">
                        <div className="bg-houseBlue rounded-full h-10 w-10 flex items-center justify-center text-white font-bold text-xl mr-3">
                            4
                        </div>
                        <h3 className={`${inter.className} text-xl font-bold text-lightModeText`}>
                            Export and Scale
                        </h3>
                    </div>
                    <p className="text-lightModeText">
                        Download CSVs or view insights to stay compliant and grow your business.
                    </p>
                </div>
            </div>

            {/* Flow Diagram */}
            <div className="mt-12 bg-gray-50 p-6 rounded-lg shadow-md">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                        src="/api/placeholder/1200/400"
                        alt="Financial Hub Workflow"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

// Section 4: Benefits for eBay Sellers
const FinancialHubBenefits = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Grow Smarter with Flippify
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                {/* Benefit 1 */}
                <div className="bg-white shadow-md rounded-3xl overflow-hidden">
                    <div className="relative h-48">
                        <Image
                            src="/api/placeholder/600/300"
                            alt="Automation"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Automation
                        </h3>
                        <p className="text-lightModeText">
                            Eliminate manual data entry with end-to-end automation. Let our system handle the heavy lifting while you focus on growing your eBay business.
                        </p>
                    </div>
                </div>

                {/* Benefit 2 */}
                <div className="bg-white shadow-md rounded-3xl overflow-hidden">
                    <div className="relative h-48">
                        <Image
                            src="/api/placeholder/600/300"
                            alt="Clarity"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Clarity
                        </h3>
                        <p className="text-lightModeText">
                            Beautifully designed reports simplify complex financials. Understand your business at a glance with our intuitive visual representations.
                        </p>
                    </div>
                </div>

                {/* Benefit 3 */}
                <div className="bg-white shadow-md rounded-3xl overflow-hidden">
                    <div className="relative h-48">
                        <Image
                            src="/api/placeholder/600/300"
                            alt="Scalability"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Scalability
                        </h3>
                        <p className="text-lightModeText">
                            Handles increased sales volume as your eBay business grows. Our platform scales with you, supporting your journey from small seller to powerhouse.
                        </p>
                    </div>
                </div>

                {/* Benefit 4 */}
                <div className="bg-white shadow-md rounded-3xl overflow-hidden">
                    <div className="relative h-48">
                        <Image
                            src="/api/placeholder/600/300"
                            alt="Support"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Support
                        </h3>
                        <p className="text-lightModeText">
                            Access our dedicated team for guidance whenever you need it. We're committed to your success with responsive and knowledgeable assistance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 bg-gray-50 p-8 rounded-3xl shadow-md">
                <p className="text-xl italic text-lightModeText mb-4">
                    "Flippify cut my accounting time in half and gave me clarity on my most profitable products. Now I can focus on growing my eBay business instead of struggling with spreadsheets."
                </p>
                <p className="text-right text-lightModeText font-semibold">
                    — Sarah T., eBay PowerSeller
                </p>
            </div>
        </div>
    );
};

// Section 5: Call to Action
const FinancialHubCTA = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="bg-gradient-to-r from-houseBlue to-blue-600 rounded-3xl p-8 md:p-12 text-white">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-center mb-6`}>
                    Ready to Take Control of Your Finances?
                </h2>
                <p className="text-center text-lg font-semibold mb-8 max-w-3xl mx-auto">
                    Start automating your eBay accounting today. Try the Financial Hub free for 14 days or schedule a demo to see it in action.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-white text-houseBlue font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition duration-200 hover:-translate-y-1">
                        Start Free Trial
                    </button>
                    <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition duration-200 hover:-translate-y-1">
                        Request a Demo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinancialHubContent;