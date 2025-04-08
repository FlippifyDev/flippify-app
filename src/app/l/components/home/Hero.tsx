import React from 'react';
import { Lato, Inter } from 'next/font/google';
import Image from 'next/image';
import HomeGetAccess from './HomeGetAccess';

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const Hero = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left Side: Header, Subtitle, and Button */}
            <div className="w-full lg:w-2/3">
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-[120px] xl:mt-[140px] text-4xl sm:text-5xl md:text-6xl text-left animate-fadeInPrimary">
                    <p className={`${inter.className} mb-2 text-white font-bold`}>
                        Inventory & Warehouse
                    </p>
                    <p className={`${lato.className} from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}>
                        Mangement Software
                    </p>
                </div>
                <p className="mt-6 sm:mt-8 md:mt-10 lg:mt-[30px] xl:mt-[35px] mb-8 pb-1 pt-2 text-gray-300 text-base sm:text-lg md:text-xl text-left animate-fadeInSecondary">
                    Streamline your warehouse management system, control stock, and optimize listings with automated tools. Whether you&apos;re running an eBay store, using an eBay business account, or exploring websites like eBay — we help you sell smarter and scale faster.
                </p>
                <HomeGetAccess />
            </div>
            {/* Right Side: Image */}
            <div className="w-full lg:w-1/3 hidden lg:block">
                <Image
                    src="/hero/home.png"
                    alt="Flippify Home"
                    className="w-full h-auto mt-8 sm:mt-10 md:mt-12 lg:mt-[90px] animate-fadeInSecondary"
                    width={1000}
                    height={1000}
                />
            </div>
        </div>
    )
}


export default Hero;
