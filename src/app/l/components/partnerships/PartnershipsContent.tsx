"use client";

import { Lato, Inter } from "next/font/google";
import PartnershipsContactForm from "./PartnershipsContactForm";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PartnershipsContent = () => {
    return (
        <div className="partnerships-details-container">
            {/* Section 1: Introduction with Value Proposition */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex flex-col lg:flex-row items-start justify-between gap-8">
                {/* Left Side: Header, Subtitle, and Button */}
                <div className="w-full lg:w-1/2">
                    <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] text-4xl sm:text-5xl md:text-6xl text-left animate-fadeInPrimary">
                        <p className={`${inter.className} mb-2 text-white font-bold`}>
                            Grow your business
                        </p>
                        <p className={`${lato.className} from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}>
                            <span className={`${inter.className} mb-8 text-white font-bold`}>
                                as a{" "}
                            </span>
                            Flippify{" "}
                            <span className={`${inter.className} mb-8 text-white font-bold`}>
                                partner
                            </span>
                        </p>
                    </div>
                    <p className="mt-6 sm:mt-8 md:mt-10 lg:mt-[30px] xl:mt-[35px] mb-8 pb-1 pt-2 text-gray-300 text-base sm:text-lg md:text-xl text-left animate-fadeInSecondary">
                        Partner with Flippify to unlock new revenue streams, enhance your offerings, and empower your clients with cutting-edge e-commerce automation.
                    </p>
                    <a
                        href="#contact-form"
                        className="btn bg-white text-black rounded-lg px-6 sm:px-8 md:px-[30px] hover:text-white hover:bg-houseHoverBlue hover:shadow-lg hover:pb-[2px] border-none transform-duration-400 transition-duration-400 animate-fadeInPrimary"
                    >
                        Apply to Join
                    </a>
                </div>
                {/* Right Side: Image */}
                <div className="w-full lg:w-1/3 hidden lg:block">
                    <img
                        src="/partnershipsHeroIcon.png"
                        alt="Flippify Partnerships"
                        className="w-full h-auto mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] animate-fadeInSecondary"
                    />
                </div>
            </div>

            {/* Section 2: Boost Your Business with Flippify */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-16 sm:mt-20 md:mt-24 lg:mt-[200px] xl:mt-[280px]">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                    Boost Your Business with Flippify
                </h2>
                <p className="text-left text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                    Partnering with Flippify supercharges your business with a generous revenue share, dedicated support, and resources to seamlessly promote our tools to your audience.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
                    <div className="bg-white p-4 sm:p-6 md:p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg sm:text-xl md:text-xl font-semibold mb-3 sm:mb-4 md:mb-4">40% Revenue Share</h3>
                        <p className="text-gray-700">
                            Earn 40% of every sale when your audience uses your exclusive coupon codes.
                        </p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 md:p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg sm:text-xl md:text-xl font-semibold mb-3 sm:mb-4 md:mb-4">Dedicated Support</h3>
                        <p className="text-gray-700">
                            Get priority assistance from our team to ensure your partnership thrives.
                        </p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 md:p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg sm:text-xl md:text-xl font-semibold mb-3 sm:mb-4 md:mb-4">Earnings Dashboard</h3>
                        <p className="text-gray-700">
                            Track your commissions in real-time through a partner dashboard (coming soon).
                        </p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 md:p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg sm:text-xl md:text-xl font-semibold mb-3 sm:mb-4 md:mb-4">Promo Materials</h3>
                        <p className="text-gray-700">
                            Access co-branded graphics and content to promote Flippify easily.
                        </p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 md:p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg sm:text-xl md:text-xl font-semibold mb-3 sm:mb-4 md:mb-4">Early Partner Perks</h3>
                        <p className="text-gray-700">
                            Be featured in case studies showcasing your success as an early Flippify partner.
                        </p>
                    </div>
                    <div className="bg-white p-4 sm:p-6 md:p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg sm:text-xl md:text-xl font-semibold mb-3 sm:mb-4 md:mb-4">Exclusive Coupon Codes</h3>
                        <p className="text-gray-700">
                            Receive unique codes to share with your audience for tracking sales.
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 3: Empower Your Clients with Advanced Tools */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                    Empower Your Clients with Advanced Tools
                </h2>
                <p className="text-left text-lightModeText font-semibold mb-8 sm:mb-10 md:mb-12">
                    Enhance your offerings by providing your clients with Flippify’s AI-driven automation tools. These advanced solutions streamline listings, pricing, and inventory management, saving your clients time, reducing errors, and boosting their profits—making you a valuable partner in their success.
                </p>
            </div>

            {/* Section 4: Expand Your Reach with Flippify Challenges */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                    Expand Your Reach with Flippify Challenges
                </h2>
                <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                    Collaborate with Flippify to launch engaging social media challenges that captivate your audience and attract new clients, showcasing the power of our AI tools to drive results. Whether you’re a reselling group, a marketing agency, or a software provider, these challenges offer a unique way to demonstrate value and grow your business.
                </p>
                <p className="text-left text-lightModeText font-semibold">
                    Partner with us to host challenges—like ‘Who can make the most profit in 30 days?’—where we’ll promote your business, select participants, and track results using our tools. It’s a win-win: your audience sees the benefits of automation, and you gain exposure and new sign-ups. For instance, Discord reselling groups can showcase how their members thrive with Flippify.
                </p>
            </div>

            {/* Section 5: How to Join the Flippify Partner Network */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                    How to Join the Flippify Partner Network
                </h2>
                <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                    Joining the Flippify Partner Network is straightforward: express your interest, get approved post-beta, receive your unique coupon codes, promote Flippify to your audience, and earn a 40% commission on every sale. Our onboarding process is designed to fit seamlessly into your business model, whether you’re leading a community or offering specialized services.
                </p>
                <ol className="list-decimal list-inside text-left text-lightModeText space-y-4">
                    <li>
                        <strong>Express Interest</strong>: Open a ticket or email partnerships@flippify.com to tell us about your business.
                    </li>
                    <li>
                        <strong>Get Approved</strong>: After our beta phase, we’ll review your application and onboard you as a partner.
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

            {/* Section 6: Call to Action */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28" id="contact-form">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                    Ready to Partner with Flippify?
                </h2>
                <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                    We’re excited to connect with a wide range of potential partners, from reselling groups and eBay sellers to software providers and consultants. While partnerships are on hold during our beta phase, we encourage you to express your interest now—we’ll reach out as soon as we’re ready to onboard new partners.
                </p>
                <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                    Open a ticket or email{" "}
                    <a href="mailto:partnerships@flippify.com" className="text-blue-400 hover:underline">
                        partnerships@flippify.com
                    </a>{" "}
                    to let us know you’re interested. For example, reselling group leaders can get ahead by signing up early!
                </p>
                <PartnershipsContactForm />
            </div>

            {/* Section 7: Future Success Teaser */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28">
                <h2 className={`${inter.className} text-3xl sm:text-4xl md:text-4xl font-bold text-left text-lightModeText mb-4 sm:mb-6 md:mb-8`}>
                    Success Stories on the Horizon
                </h2>
                <p className="text-left text-lightModeText font-semibold mb-6 sm:mb-8 md:mb-10">
                    As our partner network expands, we’ll feature standout partners in case studies, highlighting how Flippify’s AI tools have driven success across diverse business models. Join us early to be part of these inspiring stories and gain visibility in the e-commerce community.
                </p>
                <p className="text-left text-lightModeText font-semibold">
                    Be among the first to showcase your success with Flippify—whether you’re a reselling group leader or a software innovator!
                </p>
            </div>

            {/* Section 8: FAQ */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-28 mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28">
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
                            Once partnerships launch, you’ll get access to a dashboard to monitor your 40% commission in real-time.
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
                            We’re in beta now, but we’ll onboard partners soon—express interest to get in line!
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-left">What support do partners get?</p>
                        <p className="text-left">
                            You’ll receive promo materials, priority support, and collaboration opportunities like challenges.
                        </p>
                    </div>
                </div>
            </div>
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[150px] xl:pt-[180px]" />
        </div>
    );
};

export default PartnershipsContent;