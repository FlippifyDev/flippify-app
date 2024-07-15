import React from "react";
import PriceCard from "./PriceCard";
import { Lato, Inter } from "next/font/google";

import ServerPlansWhatsIncluded from "./ServerPlansWhatsIncluded";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ServerPriceList = () => {
  return (
    <div className="flex flex-col justify-center xl:w-11/12 h-full mb-5 mt-5">
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="flex justify-center mx-2">
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
          <p className="mx-4 sm:mx-2 text-white text-lg sm:text-xl text-center">
            Looking to integrate a bot into your server? Discover powerful features designed to elevate your Discord community&apos;s interaction.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        <PriceCard
          title="Lego Retirement Deals"
          description="Enhance your reselling efficiency with our cutting-edge bot, scanning diverse websites to identify Lego sets nearing retirement and ensuring you never miss a profitable sale."
          prices={[149.99, 199.99]}
          whatsIncludedComponent={<ServerPlansWhatsIncluded whatsIncludedText={["eBay Price Comparison", "Keepa Link Included", "Retirement Date Included", "Currently UK Sites Only", "Continual Website Additions"]}/>}
        />
        <PriceCard
          title="HotUKDeals"
          description="Effortlessly discover profitable reselling opportunities with our advanced webscraper, which scans hotukdeals.co.uk and compares prices with sold items on eBay to maximize your profits."
          prices={[69.99, 99.99]}
          whatsIncludedComponent={<ServerPlansWhatsIncluded whatsIncludedText={["eBay Price Comparison", "HotUKDeals Price Tracking", "Alerts based on eBay profit potential", "UK Sites Only", "Frequent electronics deal alerts"]}/>}
        />
      </div>
    </div>
  );
}

export default ServerPriceList;
