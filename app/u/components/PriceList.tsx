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
        <div className="flex justify-center">
          <p
            className={`${lato.className} text-5xl text-gradient bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent py-1`}
          >
            Pricing
            <a
              className={`${inter.className} mb-8 text-lightModeText text-5xl font-bold`}
            >
              {/* This is the space between pricing and made easy */} made easy
            </a>
          </p>
        </div>
        <div className="flex justify-center max-w-2xl">
          <p className="mx-4 sm:mx-2 text-lightModeText  text-lg text-center">
            An all-in-one service meaning you get everything you need with just one plan
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        <PriceCard
          title="Early Access Sale"
          description="Gain access to our all-in-one service providing all tools, bots and insights needed to accelerate your profits."
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
