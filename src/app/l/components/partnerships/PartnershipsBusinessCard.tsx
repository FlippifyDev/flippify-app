import React, { useState } from "react";
import PartnershipsApplyButton from "./PartnershipsApplyButton";
import Image from "next/image";
import { Inter, Lato } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

interface ServicesToolsCardProps {
    title: string;
    subtitle: string;
    bulletPoints: string[];
    disclaimer: string | null;
    image: string;
    comingSoon?: boolean;
    releasingSoon?: boolean;
}

const PartnershipsBusinessCard: React.FC<ServicesToolsCardProps> = ({
    title,
    subtitle,
    bulletPoints,
    disclaimer,
    image,
    comingSoon = false,
    releasingSoon = false,
}) => {
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    const handleToggleDisclaimer = () => {
        setShowDisclaimer(!showDisclaimer);
    };

    return (
        <div className="bg-white w-full shadow-lg h-full mt-4 sm:mt-6 rounded-2xl animate-fadeInBounce">
            <figure className="rounded-t-2xl overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    layout="responsive"
                    width={600}  // Replace with your image's actual width
                    height={400} // Replace with your image's actual height
                    objectFit="cover"
                />
            </figure>
            <div className="card-body p-4 sm:p-3">
                <h2 className={`${inter.className} text-2xl text-left text-lightModeText font-bold`}>
                    {title}
                </h2>
                <p className="text-left text-lightModeText w-5/6 text-lg mt-2">{subtitle}</p>
                <ul className="mt-4 space-y-2">
                    {bulletPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">{point}</span>
                        </li>
                    ))}
                </ul>
                {releasingSoon && (
                    <div className="flex justify-center text-houseHoverBlue font-medium text-sm mt-2">
                        Releasing Soon
                    </div>
                )}
                {disclaimer && (
                    <div className="mt-4">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleDisclaimer();
                            }}
                            className="hover:underline text-gray-400 text-sm"
                        >
                            {showDisclaimer ? "Hide disclaimer" : "Show disclaimer"}
                        </a>
                        {showDisclaimer && (
                            <p className="mt-2 text-gray-400 text-sm">Disclaimer: {disclaimer}</p>
                        )}
                    </div>
                )}
            </div>
            {comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none backdrop-blur-sm">
                    <div className="bg-white font-semibold text-black py-2 px-4 rounded-lg shadow-xl">
                        Coming Soon
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnershipsBusinessCard;