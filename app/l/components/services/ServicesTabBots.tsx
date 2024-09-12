import ProductsCard from "./ServicesCard";
import { Lato, Inter } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });


const ProductList: React.FC = () => {
  return (
    <div className="flex flex-col flex-wrap justify-center xl:w-11/12 h-full mb-5 mt-5">
      <div className="flex flex-col items-center space-y-3 text-center mb-5">
        <div className="flex justify-center mx-2">
            <p
                className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}
            >
                Monitors
                <a
                className={`${inter.className} mb-8 text-white text-5xl font-bold`}
                >
                {/* This is a space */} Selection
                </a>
            </p>
        </div>
        <div className="flex justify-center max-w-2xl">
          <p className="mx-4 sm:mx-2 text-white text-md sm:text-lg text-center">
            Explore a curated selection of exclusive deals and offers across a variety of products. Find savings and limited-time promotions on items you love.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <ProductsCard
          title="Retiring Set Deals"
          description="Track soon-to-be-retired LEGO sets across various websites. Stay informed about valuable collector items before they disappear from shelves."
          disclaimer="Prices and availability may change or contain errors. Verify details on the respective websites and eBay before purchasing."
          image="https://i.imgur.com/xSay8Kn.png"
        />
        <ProductsCard
          title="Deal Watch UK"
          description="Discover high-demand products from hotukdeals that can be resold for profit on eBay. Our tool identifies the hottest deals and trends, helping you capitalize on profitable opportunities."
          disclaimer="We strive for accurate, up-to-date prices, but some deals may be outdated or incorrect. Verify prices and availability on hotukdeals and eBay before purchasing."
          image="https://i.imgur.com/5MQt2Gd.png"
        />
      </div>
    </div>
  );
};

export default ProductList;
