import Image from "next/image";
import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from "./HomeGetAccess";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeMockupBrowser = () => {
	const root = process.env.ROOT as string;

	return (
        <div className="flex flex-col md:flex-row justify-between gap-6 items-center max-w-6.5xl mx-auto">
			<div className="order-2 md:order-1 px-2 pt-6 md:pt-0 flex flex-col justify-start items-start">
				<p className={`${lato.className} text-4xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-start`}>
					Automate
					<a href="#" className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}>{" "}Every Step.</a>
				</p>
				<p className="pt-4 text-darkGreyText text-start font-semibold max-w-2xl ">
					Connect your eBay account for automatic listings, inventory management, order tracking, and detailed finance & tax reports. We handle everything — you just buy, ship and print profits.
				</p>
				<div className="pt-6">
					<HomeGetEarlyAccess />
				</div>
			</div>
			<div className="mockup-browser md:order-2 w-full mockup-shadow scale-[.8]">
				<div className="bg-[#222222] flex justify-center px-1 py-1">
					<figure>
						<Image
							src="/laptopMockup.png"
                            alt="Flippify desktop dashboard showing eBay store automation, inventory management system, and order fulfillment tools"
							width={2541}
							height={1354}
							loading="lazy"
							className="rounded-xl"
						/>
					</figure>
				</div>
			</div>
		</div>
	);
};

export default HomeMockupBrowser;
