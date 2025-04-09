import React from 'react';
import { Lato, Inter } from 'next/font/google';
import Image from 'next/image';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsEventsDetails = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                Collaborate and Grow with Flippify
            </h2>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
                {/* Left side content */}
                <div className="w-full md:w-3/5">
                    <p className="text-left text-lg text-lightModeText font-semibold pb-6">
                        Partner with Flippify to promote your business through tailored events and promotions that captivate your audience and attract new clients. Our collaborative approach ensures mutual growth and visibility.
                    </p>

                    <div className="relative p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Flexible Partnerships
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">From challenges to webinars or co-branded campaigns, we're open to any event that highlights your expertise and our AI tools.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="relative p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Shared Promotion
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">We love showcasing our partners, driving recognition and clients your way while expanding our reach.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="relative p-6">
                        <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-3`}>
                            Mutual Goals
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="text-houseBlue mr-2">✓</span>
                                <span className="text-lightModeText">Together, we help people start side hustles and businesses, benefiting both brands.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right side image placeholder */}
                <div className="w-full md:w-2/5 flex items-center justify-center">
                    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                        {/* Replace with your actual image */}
                        <Image
                            src="/GrowWithFlippify.png"
                            alt="Collaboration with Flippify"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* Example section at the bottom */}
            <div className="w-full bg-gray-100 p-6 rounded-3xl">
                <h3 className={`${inter.className} text-2xl text-left text-lightModeText font-bold mb-4`}>
                    Example: 30-Day Profit Challenge
                </h3>
                <p className="text-left text-lightModeText mb-6">
                    We invite applicants and select a few to use your business and Flippify's tools to maximize profits in 30 days. Their progress is posted on social media, showing how easy it is to succeed—boosting recognition and growth for us both.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-3xl">
                        <h4 className="font-bold text-lightModeText mb-2">Step 1: Application</h4>
                        <p className="text-lightModeText text-sm">We jointly promote the challenge to our audiences, gathering motivated participants.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-3xl">
                        <h4 className="font-bold text-lightModeText mb-2">Step 2: Implementation</h4>
                        <p className="text-lightModeText text-sm">Participants use your intel and our tools, documenting their journey on social media.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-3xl">
                        <h4 className="font-bold text-lightModeText mb-2">Step 3: Results</h4>
                        <p className="text-lightModeText text-sm">We showcase success stories, driving new business for both our platforms.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnershipsEventsDetails;