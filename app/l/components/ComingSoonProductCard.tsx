"use client";

import Image from "next/image";
import React from "react";

interface ComingSoonProductCardProps {
  title: string;
  description: string;
  image: string;
}

const ComingSoonProductCard: React.FC<ComingSoonProductCardProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <div className="px-2 py-2 md:px-10 md:py-10">
      <div className="card bg-black image-full max-w-lg lg:max-w-2xl shadow-lg h-auto sm:h-auto md:h-[36rem]">
        <figure className="w-full">
          <Image src={image} alt={title} width={1000} height={1000} loading="lazy" />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-white text-base md:text-xl lg:text-xl">{title}</h2>
          <p className="text-white text-sm md:text-base md:block">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonProductCard;