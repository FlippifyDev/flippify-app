import React from "react";
import { Lato, Inter } from "next/font/google";
import ServerPlansCard from "./ServerPlansCard";
import ServerPlansCardWhatsIncluded from "./ServerPlansCardWhatsIncluded";

const lato = Lato({ weight: "900", style: "italic", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

const ServerPricingPage = () => {
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
              {/* This is the space between pricing and made easy */} Made Easy.
            </a>
          </p>
        </div>
        <div className="flex justify-center max-w-2xl">
          <p className="mx-4 sm:mx-2 text-white text-md sm:text-lg text-center">
            Looking to integrate a bot into your server? Discover powerful features designed to elevate your Discord community&apos;s interaction.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center">
        <ServerPlansCard
          title="Retiring Sets Deals"
          description="Enhance your reselling efficiency with our cutting-edge bot, scanning diverse websites to identify Lego sets nearing retirement and ensuring you never miss a profitable sale."
          price={149.99}
          priceIds={{
            monthly: "price_1PfJ7pJJRepiHZ8d7gs78YEp",
            yearly: "price_1PfJ7pJJRepiHZ8dAkwkWqHy",
          }}
          whatsIncludedComponent={<ServerPlansCardWhatsIncluded whatsIncludedText={["eBay Price Comparison", "Keepa Link Included", "Retirement Date Included", "Currently UK Sites Only", "Continual Website Additions"]}/>}
          labelText="Long-Term"
          badgeColor="orangeLabel"
        />
        <ServerPlansCard
          title="Deal Watch UK"
          description="Effortlessly discover profitable reselling opportunities with our advanced webscraper, which scans hotukdeals.co.uk and compares prices with sold items on eBay to maximize your profits."
          price={69.99}
          priceIds={{
            monthly: "price_1PfJ9bJJRepiHZ8dk689bT3H",
            yearly: "price_1PfJ9bJJRepiHZ8dTK0EGZ8k",
          }}
          whatsIncludedComponent={<ServerPlansCardWhatsIncluded whatsIncludedText={["eBay Price Comparison", "HotUKDeals Price Tracking", "Alerts Based On eBay Profit Potential", "Currently UK Sites Only", "Frequent Electronics Deal Alerts"]}/>}
          labelText="Random Deals"
          badgeColor="greenLabel"
        />
      </div>
    </div>
  );
}

export default ServerPricingPage;
