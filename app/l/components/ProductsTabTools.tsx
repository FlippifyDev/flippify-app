import ProductCard from "./ProductsCard";
import { Lato, Inter } from "next/font/google";
import React from "react";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ToolList: React.FC = () => {
  return (
    <div className="flex flex-col justify-center xl:w-11/12 h-full mb-5 mt-5">
      <div className="flex flex-col items-center space-y-3 text-center mb-5">
        <div className="flex justify-center mx-2">
            <p
                className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}
            >
                Tools
                <a
                className={`${inter.className} mb-8 text-white text-5xl font-bold`}
                >
                {/* This is a space */} Selection
                </a>
            </p>
        </div>
        <div className="flex justify-center max-w-2xl">
          <p className="mx-4 sm:mx-2 text-white text-md sm:text-lg text-center">
            Uncover a handpicked collection of tools designed to simplify tasks and improve workflow efficiency, ensuring you stay ahead in today&apos;s competitive market.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center ">
        <ProductCard
          title="Smart Deal Finder"
          description="Discover unbeatable prices with our Smart Deal Finder! Effortlessly search through a vast database of thousands of products across multiple websites. Our tool provides real-time updates and detailed comparisons to help you find the best deals available."
          disclaimer={null}
          image="https://i.imgur.com/LOvfMmz.png"
        />
        <ProductCard
          title="Inventory Tracking"
          description="One of the most important aspects of reselling is keeping a consistent inventory of purchased and sold products. This allows for effective analytics, informed purchasing decisions, and streamlined operations. Soon to be automated with eBay."
          disclaimer={null}
          image="https://i.imgur.com/OnuXuDl.png"
        />
      </div>
    </div>
  );
};

export default ToolList;
