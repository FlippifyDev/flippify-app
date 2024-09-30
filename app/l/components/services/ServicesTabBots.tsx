import ProductsCard from "./ServicesBotsCard";
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
            Our monitors scan hundreds of sites to find the most profitable deals, using advanced algorithms to compare prices with eBay and Amazon—delivering top opportunities directly to you.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <ProductsCard
          title="Deal Watch UK"
          description="Find high-demand products from top deal sites like hotukdeals & rewarddeals, filtered and compared to eBay prices for maximum profitability. Spot opportunities across a wide range of categories."
          disclaimer="Deals may expire or be inaccurate. Confirm prices and stock on deal sites and eBay before making a purchase."
          image="https://i.imgur.com/elI3IE7.png"
        />
        <ProductsCard
          title="Electronics"
          description="Discover fast-selling electronics with big discounts and high resale value. Our tool monitors thousands of items, finding consistent, profitable deals that sell quickly for easy returns."
          disclaimer="Prices and availability may change. Verify all details on the seller's site and eBay before purchasing."
          image="https://i.imgur.com/8JK1AMT.png"
        />
        <ProductsCard
          title="Retiring Sets"
          description="Track soon-to-retire LEGO sets across various sites and stay ahead of collectors. Secure valuable sets before they vanish, with potential long-term profit as prices rise post-retirement."
          disclaimer="Prices and availability may fluctuate. Always verify details on respective websites and eBay before purchasing."
          image="https://i.imgur.com/pgcpi13.png"
        />
      </div>
    </div>
  );
};

export default ProductList;
