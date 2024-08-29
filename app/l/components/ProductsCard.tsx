"use client";

import ProductsCardViewPrices from "./ProductsCardViewPricesButton";

import Image from "next/image";
import { Lato, Inter } from "next/font/google";
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
    <div className="border card card-compact m-4 mx-10 p-2 bg-base-100 w-80 sm:w-96 shadow-xl h-[38rem] mt-10">
      <figure className="h-72 overflow-y-auto">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            width={500}
            height={800}
            className="object-cover"
          />
        </div>
      </figure>
      <div className="card-body">
        <h2
          className={`${lato.className} text-2xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}
        >
          {title}
        </h2>
        <hr className="w-full" />
        <p className="flex items-center text-white">{description}</p>
        {disclaimer && (
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleToggleDisclaimer();
              }}
              className="hover:underline text-white"
            >
              {showDisclaimer ? "Hide disclaimer" : "Show disclaimer"}
            </a>
            {showDisclaimer && (
              <>
                <p className="mt-2">Disclaimer: {disclaimer}</p>
              </>
            )}
          </div>
        )}
        <hr className="w-full mb-1" />
        <div className="card-actions justify-end">
          <ProductsCardViewPrices />
        </div>
      </div>
    </div>
  );
};

export default ProductsCard;
