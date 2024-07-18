"use client";

import ViewPrices from "./ViewPrices";

import Image from "next/image";
import { Lato, Inter } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <div className="border card card-compact m-4 mx-10 p-2 bg-base-100 w-80 sm:w-96 shadow-xl h-[36rem] mt-10">
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
        <h2 className={`${lato.className} text-2xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}>{title}</h2>
        <hr className="w-full" /><p className="flex items-center">{description}</p><hr className="w-full mb-1" />
        <div className="card-actions justify-end">
          <ViewPrices />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

/*

    <div className="px-2 py-2 md:px-10 md:py-10">
      <div className="card bg-black image-full max-w-lg lg:max-w-2xl shadow-lg h-[26rem] md:h-[36rem] flex flex-col">
        <figure className="w-full">
          <Image
            src={image}
            alt={title}
            width={1000}
            height={1000}
            loading="lazy"
          />
        </figure>
        <div className="card-body flex flex-col justify-between">
          <div>
            <h2 className="card-title text-white text-base md:text-xl lg:text-xl">
              {title}
            </h2>
            <p className="text-white text-sm md:text-base hidden md:block mt-5">
              {description}
            </p>
            {websites.length > 0 && (
              <p className="text-white text-sm md:text-base mt-10">
                {websiteDescription}
                <br />
                {websites.map((website, index) => (
                  <span key={index} className="block">
                    • {website}
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="mt-auto">
            <div className="card-actions flex justify-center sm:justify-end">
              <ViewPrices />
            </div>
          </div>
        </div>
      </div>
    </div>
*/
