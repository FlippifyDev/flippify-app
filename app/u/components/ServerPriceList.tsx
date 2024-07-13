import React from "react";
import PriceCard from "./PriceCard";
import { Lato, Inter } from "next/font/google";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ServerPriceList = () => {
  return (
    <div className="flex flex-col justify-center xl:w-11/12 h-full mb-5 mt-5">
      <div className="flex flex-col items-center space-y-5 text-center">
        <div className="flex justify-center">
          <p
            className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}
          >
            Server Integration
            <a
              className={`${inter.className} mb-8 text-white text-5xl font-bold`}
            >
              {/* This is the space between pricing and made easy */} made easy
            </a>
          </p>
        </div>
        <div className="flex justify-center max-w-2xl">
          <p className="mx-4 sm:mx-2 text-white text-xl text-center">
            Want this bot in your server? This option is for you. Get results with powerful features tailored for enhancing your Discord community's experience.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        <PriceCard
          title="Lego Retirement Sales"
          description="Want bots in your server? These options are for you. Get results with powerful features tailored for enhancing your Discord community's experience."
          prices={[149.99, 199.99]}
          priceIds={{
            monthly: "price_1Pc8wGJJRepiHZ8dDTmbKUHc",
            yearly: "price_1Pc8x7JJRepiHZ8dbkiJkQzx",
          }}
        />
      </div>
    </div>
  );
};

export default ServerPriceList;
