import React, { useState } from "react";
import ServicesGetAccessButton from "./ServicesGetAccessButton";
import Image from "next/image";
import { Lato } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });

interface ServicesToolsCardProps {
  title: string;
  description: string;
  disclaimer: string | null;
  image: string;
  comingSoon?: boolean; // New optional prop
}

const ServicesToolsCard: React.FC<ServicesToolsCardProps> = ({
  title,
  description,
  disclaimer,
  image,
  comingSoon = false,
}) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleToggleDisclaimer = () => {
    setShowDisclaimer(!showDisclaimer);
  };

  return (
    <div className="card card-compact m-2 p-2 bg-white w-72 sm:w-80 shadow-lg h-[500px] mt-6 relative rounded-2xl overflow-hidden animate-floatUp">
      <figure className="h-62">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            width={800}
            height={900}
            className="object-cover h-full w-full"
            style={{ objectFit: "cover" }}
          />
        </div>
      </figure>
      <div className="card-body p-3">
        <h2
          className={`${lato.className} text-2xl flex justify-center text-center text-houseBlue`}
        >
          {title}
        </h2>
        <hr className="w-full" />
        <p className="flex items-center font-medium text-center pt-2 text-lightModeText">
          {description}
        </p>
        {disclaimer && (
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleToggleDisclaimer();
              }}
              className="hover:underline text-gray-400"
            >
              {showDisclaimer ? "Hide disclaimer" : "Show disclaimer"}
            </a>
            {showDisclaimer && (
              <p className="mt-2 text-gray-400">Disclaimer: {disclaimer}</p>
            )}
          </div>
        )}
        <hr className="w-full mb-1" />
        <div className="card-actions justify-end">
          <ServicesGetAccessButton />
        </div>
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

export default ServicesToolsCard;
