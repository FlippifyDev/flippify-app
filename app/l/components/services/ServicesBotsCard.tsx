"use client";

import ServicesGetAccessButton from "./ServicesGetAccessButton";

import Image from "next/image";
import { Lato } from "next/font/google";
import React, { useState } from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });


interface ProductsCardProps {
  title: string;
  description: string;
  disclaimer: string | null;
  image: string;
}

const ProductsCard: React.FC<ProductsCardProps> = ({
  title,
  description,
  disclaimer,
  image,
}) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleToggleDisclaimer = () => {
    setShowDisclaimer(!showDisclaimer);
  };

  return (
    <div className="border card card-compact m-4 mx-10 p-2 bg-white w-80 sm:w-96 shadow-xl h-[34rem] sm:h-[38rem] mt-10">
      <figure className="h-72 overflow-y-auto">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            width={500}
            height={1000}
            className="object-cover"
          />
        </div>
      </figure>
      <div className="card-body">
        <h2
          className={`${lato.className} text-2xl pb-2 flex justify-center text-houseBlue`}
        >
          {title}
        </h2>
        <hr className="w-full sm:mb-[-10px]" />
        <p className="flex items-center font-medium text-center text-lightModeText">{description}</p>
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
              <>
                <p className="mt-2 text-gray-400">Disclaimer: {disclaimer}</p>
              </>
            )}
          </div>
        )}
        <hr className="w-full mb-1" />
        <div className="card-actions justify-end">
          <ServicesGetAccessButton />
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
