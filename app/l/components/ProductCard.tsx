"use client";

import ViewPrices from "./ViewPrices";
import Image from "next/image";

import React from "react";

interface ProductCardProps {
  title: string;
  description: string;
  image: string;
  websites: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  image,
  websites,
}) => {
  return (
    <div className="px-10 py-10">
      <div className="card bg-black image-full max-w-lg lg:max-w-2xl mx-auto h-[36rem] shadow-lg">
        <figure className="w-full">
          <Image src={image} alt={title} width={1000} height={1000} />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-white">{title}</h2>
          <p className="text-white">{description}</p>
          {websites.length > 0 && (
            <p className="text-white">
              Currently Supporting:
              <br />
              {websites.map((website, index) => (
                <span key={index} className="block">
                  • {website}
                </span>
              ))}
            </p>
          )}
          <div className="card-actions justify-end">
            <ViewPrices />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
