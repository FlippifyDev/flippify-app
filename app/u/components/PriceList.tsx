import PriceCard from "./PriceCard";
import PlansWhatsIncluded from "./PlansWhatsIncluded";


import React from "react";
import { Lato, Inter } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const PriceList = () => {
  return (
    <div className="flex flex-col justify-center xl:w-11/12 h-full mb-5">
      <div className="flex flex-col items-center space-y-5 text-center">
        <div className="flex flex-wrap justify-center items-center text-4xl sm:text-5xl w-4/5 sm:w-full">
          <p
            className={`${lato.className} text-gradient bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent py-1`}
          >
            Pricing
            <a
              className={`${inter.className} mb-8 text-lightModeText font-bold`}
            >
              {/* This is the space between pricing and made easy */} made easy
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
            An all-in-one service meaning you get everything you need with just one plan
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        <PriceCard
          title="Early Access Sale"
          description="Unlock unlimited access to our comprehensive suite of tools, bots, and insights designed to supercharge your profitability. Our all-in-one subscription provides everything you need to optimize performance and drive growth."
          prices={[44.99, 59.99]}
          priceIds={{
            monthly: "price_1PctCCJJRepiHZ8d6M7w0P7g",
            yearly: "price_1Pcu1rJJRepiHZ8d4zAXLEpL",
          }}
          whatsIncludedComponent={<PlansWhatsIncluded />}
          labelText="All-in-one"
          badgeColor="blueLabel"
        />
      </div>
    </div>
  );
};

export default PriceList;
