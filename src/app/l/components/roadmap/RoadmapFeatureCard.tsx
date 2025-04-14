import React from "react";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface RoadmapFeatureCardProps {
    title: string;
    description: string;
    bulletPoints: string[];
    image: string;
    comingSoon?: boolean;
    releasingSoon?: boolean;
}

const RoadmapFeatureCard: React.FC<RoadmapFeatureCardProps> = ({
    title,
    description,
    bulletPoints,
    image,
    comingSoon,
    releasingSoon
}) => {
    return (
        <div className="bg-white w-full shadow-lg h-full mt-4 sm:mt-6 rounded-2xl animate-fadeInBounce relative">
            <figure className="rounded-t-2xl overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    width={600}
                    height={400}
                    className="object-cover"
                />
            </figure>
            <div className="card-body p-4 sm:p-6">
                <h2 className={`${inter.className} text-2xl text-left text-lightModeText font-bold`}>
                    {title}
                </h2>
                <p className="text-left text-lightModeText text-lg mt-2">{description}</p>
                <ul className="mt-4 space-y-2">
                    {bulletPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                            <span className="text-houseBlue mr-2">✓</span>
                            <span className="text-lightModeText">{point}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RoadmapFeatureCard;