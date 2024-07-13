import React from "react";
import ServerBotsPriceCard from "./ServerBotsPriceCard";
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
            Want our bots in your server? This option is for you. Quick and Easy Integration from our control panel, all you need to do is choose the bots you want!
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        <ServerBotsPriceCard
          title="Lego Retirement Sales"
          description="Perfect for a longer-term and higher reward flips. Scouting on great deals on soon-to-retire lego sets that are bound to skyrocket in value."
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
