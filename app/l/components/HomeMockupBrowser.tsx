import Image from "next/image";
import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from "./HomeGetEarlyAccess";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeMockupBrowser = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 pt-12 mx-8 md:mx-1 lg:mx-2 xl:mx-8 place-content-center">
      <div className="order-2 md:order-1 px-2 pt-6 md:pt-0 lg:pt-20 xl:pt-44">
        <p className={`${lato.className} text-4xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
          Automate
          <a href="#" className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}>{" "}Every Step.</a>
        </p>
        <p className="pt-4 text-darkGreyText text-center font-semibold">
        Connect your eBay and Amazon accounts for automatic listings, inventory management, track orders, and get detailed financial and tax reports. We handle everything — you just buy, ship and print profits.
        </p>
        <div className="flex justify-center pt-6">
          <HomeGetEarlyAccess />
        </div>
      </div>
      <div className="mockup-browser order-1 bg-gray-100 md:order-2 w-full md:w-auto mockup-shadow">
        <div className="mockup-browser-toolbar bg-gray-100">
          <div className="input !bg-gray-200 text-black border-2 border-gray-300">https://flippify.co.uk</div>
        </div> 
        <div className="bg-white flex justify-center px-1 py-1">
          <figure>
            <Image
              src="https://i.imgur.com/9it15G1.png"
              alt="Browser Mockup"
              width={2448}
              height={1336}
              loading="lazy"
              className="rounded-lg mb-2"
            />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default HomeMockupBrowser;
