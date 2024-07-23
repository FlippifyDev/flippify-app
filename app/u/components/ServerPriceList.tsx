import React from "react";
import PriceCard from "./PriceCard";
import { Lato, Inter } from "next/font/google";

import ServerPlansWhatsIncluded from "./ServerPlansWhatsIncluded";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ServerPriceList = () => {
  return (
    <div className="flex flex-col justify-center xl:w-11/12 h-full mb-5 mt-5">
      <div className="flex flex-col items-center space-y-5 text-center">
        <div className="flex justify-center">
          <p
            className={`${lato.className} text-4xl sm:text-5xl w-4/5 sm:w-full text-gradient bg-gradient-to-tr from-blue-500 to-purple-500 bg-clip-text text-transparent py-1`}
          >
            Server Integration
            <a
              className={`${inter.className} mb-8 text-lightModeText text-4xl sm:text-5xl font-bold`}
            >
              {/* This is the space between pricing and made easy */} Made Easy.
            </a>
          </p>
        </div>
        <div className="flex justify-center w-4/5 sm:w-full">
          <p className="mx-4 sm:mx-2 text-lightModeText text-md sm:text-lg text-center">
            Looking to integrate a bot into your server? <br />Discover powerful features designed to elevate your Discord community&apos;s interaction.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        <PriceCard
          title="Retiring Sets Deals"
          description="Enhance your reselling efficiency with our cutting-edge bot, scanning diverse websites to identify Lego sets nearing retirement and ensuring you never miss a profitable sale."
          prices={[149.99, 199.99]}
          priceIds={{
            monthly: "price_1PctChJJRepiHZ8dIREA1uKf",
            yearly: "price_1Pcu3kJJRepiHZ8dIYtT80Wl",
          }}
          whatsIncludedComponent={<ServerPlansWhatsIncluded whatsIncludedText={["eBay Price Comparison", "Keepa Link Included", "Retirement Date Included", "Currently UK Sites Only", "Continual Website Additions"]}/>}
          labelText="Long-Term"
          badgeColor="orangeLabel"
        />
        <PriceCard
          title="Deal Watch UK"
          description="Effortlessly discover profitable reselling opportunities with our advanced webscraper, which scans hotukdeals.co.uk and compares prices with sold items on eBay to maximize your profits."
          prices={[69.99, 99.99]}
          priceIds={{
            monthly: "price_1PcuH1JJRepiHZ8d4HTovHWm",
            yearly: "price_1PcuHmJJRepiHZ8duS8nBti1",
          }}
          whatsIncludedComponent={<ServerPlansWhatsIncluded whatsIncludedText={["eBay Price Comparison", "HotUKDeals Price Tracking", "Alerts based on eBay profit potential", "Currently UK Sites Only", "Frequent electronics deal alerts"]}/>}
          labelText="Random Deals"
          badgeColor="greenLabel"
        />
      </div>
    </div>
  );
}

export default ServerPriceList;
