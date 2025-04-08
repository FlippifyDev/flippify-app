"use client";

import { Lato, Inter } from "next/font/google";
import HomeGetAccess from "./HomeGetAccess";
import HomeMockupPhone from "./HomeMockupPhone";
import HomeMockupBrowser from "./HomeMockupBrowser";
import HomeVideoShowcase from "./HomeVideoShowcase";
import GroupInformation from "./GroupInformation";
import Hero from "../dom/Hero";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const Page = ({ className = "" }) => {
    return (
        <div className={`home-details-container ${className} w-full`}>
            <div className="flex flex-col items-center w-full">
                <Hero 
                    text={[{ text: "Inventory & Order" }, { "text": "Mangement Software", isGradient: true}]}
                    description="Streamline your warehouse management system, control stock, and optimize listings with automated tools. Whether you&apos;re running an eBay store, using an eBay business account, or exploring websites like eBay — we help you sell smarter and scale faster."
                    button={<HomeGetAccess />}
                    image="/hero/home.png"
                    imageAlt="Flippify Home"
                    imageContainerClassName="scale-150"
                />

                <div className="pt-[90px] lg:pt-[150px]" />
                <div className="max-w-5.5xl relative w-full mb-4 py-8 px-2 sm:py-2 md:my-11 md:mx-6 md:py-0 md:pl-4 animate-fadeInPrimary">
                    <HomeVideoShowcase />
                </div>

                <div className="max-w-5.5xl pb-20 pt-10">
                    <p className={`${lato.className} text-5xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
                        <span className={`${inter.className} mb-8 text-lightModeText text-5xl font-bold`}>
                            Automating your store with
                        </span>
                        {/* Space */} AI
                    </p>
                    <p className="pt-4 text-lightModeText text-center font-semibold lg:w-4/5 mx-auto">
                        Put your eBay business account on autopilot. Our AI-powered system helps you list products, manage inventory, process orders, and handle finances—seamlessly integrated with your warehouse management system. Perfect for dropshippers, eBay sellers, and anyone scaling a store across platforms like Shopify or websites like eBay.
                    </p>
                </div>

                <div className="w-full flex flex-col justify-center">
                    <div className="w-full border-b border-dashed"></div>
                    <div className="w-full bg-white py-20">
                        <HomeMockupPhone />
                    </div>
                    <div className="w-full border-b border-dashed"></div>
                    <div className="w-full bg-[#f6f9fc] py-20">
                        <HomeMockupBrowser />
                    </div>
                    <div className="w-full border-b border-dashed"></div>
                    <div className="w-full bg-white py-20">
                        <GroupInformation />
                    </div>
                    <div className="w-full border-b border-dashed"></div>
                </div>
            </div>
        </div>
    );
};

export default Page;