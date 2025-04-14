import React from 'react';
import HomeGetAccess from '../home/HomeGetAccess';
import Image from 'next/image';

interface DiscordButtonProps {
    inviteLink: string;
}

const DiscordButton: React.FC<DiscordButtonProps> = ({ inviteLink }) => {
    return (
        <a
            href={inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5865F2] hover:bg-[#4752c4] transition-colors duration-200 text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 127.14 96.36"
                className="w-6 h-6"
                fill="currentColor"
            >
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
            <span>Join Our Discord</span>
        </a>
    );
};

const FAQMoreSupport: React.FC = () => {
    const discordInviteLink: string = "https://discord.gg/gNPYfe7YFm";

    return (
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
            <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-3/5 pr-0 md:pr-8 mb-8 md:mb-0">
                    <h2 className="text-3xl sm:text-4xl font-bold text-lightModeText mb-4">
                        Didn't have your question answered? We got you covered!
                    </h2>
                    <p className="text-lg text-lightModeText mb-6">
                        Come join our welcoming community full of eBay sellers just like you! We're here to help you with any questions or concerns you may have. Our team is dedicated to providing you with the support you need to succeed. Whether you're looking for tips, advice, service updates or just someone to talk to, we're here for you. Join us today and let's grow together!
                    </p>
                    <div className="mt-6">
                        <DiscordButton inviteLink={discordInviteLink} />
                    </div>
                </div>
                <div className={`w-full lg:w-1/3 pt-10 md:pt-0 lg:scale-125 select-none`}>
                    <Image
                        src={"/faq/MoreSupport.svg"}
                        alt={"Simplify your eBay store management with Flippify's all-in-one solution."}
                        className={`w-full h-auto animate-fadeInSecondary scale-125`}
                        width={500}
                        height={500}
                    />
                </div>
            </div>
        </div>
    );
};

export default FAQMoreSupport;