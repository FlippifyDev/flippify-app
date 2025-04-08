import React from 'react';
import { Lato, Inter } from 'next/font/google';
import Image from 'next/image';
import HomeGetAccess from '../home/HomeGetAccess';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const Hero = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left Side: Header, Subtitle, and Button */}
            <div className="w-full lg:w-3/5">
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] text-4xl sm:text-5xl md:text-6xl text-left animate-fadeInPrimary">
                    <p className={`${inter.className} mb-2 text-white font-bold`}>
                        Smart Inventory 
                    </p>
                    <p className={`${lato.className} from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}>
                        <span className={`${inter.className} mb-8 text-white font-bold`}>
                            Control{" "}
                        </span>
                        for eBay{" "}
                    </p>
                </div>
                <p className="mt-6 sm:mt-8 md:mt-10 lg:mt-[30px] xl:mt-[35px] mb-8 pb-1 pt-2 text-gray-300 text-base sm:text-lg md:text-xl text-left animate-fadeInSecondary">
                    Flippify’s inventory software keeps your stock synced with eBay whilst allowing you to upload your own custom stock. Track levels in real-time, avoid overselling, and manage your warehouse with ease.
                </p>
                <HomeGetAccess />
            </div>
            {/* Right Side: Image */}
            <div className="w-full lg:w-2/5 hidden lg:block">
                <Image
                    src="/hero/inventoryManagement.png"
                    alt="Flippify Inventory Management"
                    className="w-full h-auto mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] animate-fadeInSecondary"
                    width={2000}
                    height={2000}
                />
            </div>
        </div>
    )
}


export default Hero;
