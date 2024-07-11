import Image from "next/image";
import { Lato, Inter } from 'next/font/google';
import GetEarlyAccess from "./GetEarlyAccess";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const BrowserMockup = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 pt-12">
      <div className="order-2 md:order-1 pt-6 md:pt-56 px-2">
        <p className={`${lato.className} text-4xl from-darkTextGradStart to-darkTextGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
          Boost
          <a className={`${inter.className} mb-8 text-headingDarkText text-4xl font-bold`}> Reselling Efficiency.</a>
        </p>
        <p className="pt-4 text-darkGreyText text-center font-semibold">
        Access exclusive tools to automate and streamline your reselling. Enjoy seamless integration with Discord and other platforms, offering features you won&apos;t find anywhere else.
        </p>
        <div className="flex justify-center pt-6">
          <GetEarlyAccess />
        </div>
      </div>
      <div className="mockup-browser bg-base-300 order-1 md:order-2 w-full md:w-auto">
        <div className="mockup-browser-toolbar">
          <div className="input">https://flippify.co.uk</div>
        </div> 
        <div className="bg-base-200 flex justify-center px-4 py-1">
          <figure>
            <Image
              src="https://i.imgur.com/IcHL9wg.png"
              alt="Browser Mockup"
              width={960}
              height={540}
              loading="lazy"
            />
          </figure>
        </div>
      </div>
    </div>
  );
};

export default BrowserMockup;
