import Image from "next/image";
import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from "./HomeGetAccess";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeMockupBrowser = () => {
	const root = process.env.ROOT as string;

	return (
		<div className="flex flex-col md:flex-row justify-between gap-6 items-center max-w-6.5xl mx-auto p-2 md:p-2">
			<div className="order-2 md:order-1 px-2 pt-6 md:pt-0 flex flex-col justify-start items-start">
				<p className={`${lato.className} text-4xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-start`}>
					Automate
					<a href="#" className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}>{" "}Every Step.</a>
				</p>
				<p className="pt-4 text-darkGreyText text-start font-semibold max-w-2xl ">
					Connect your eBay account for inventory management, order tracking, and detailed finance & tax reports, with features like automated listings also in the works. We handle everything — you just buy, ship and print profits.
				</p>
				<div className="pt-6">
					<HomeGetEarlyAccess />
				</div>
			</div>
			<div className="md:order-2 border-2 border-white bg-gray-100/80 p-3 rounded-4xl shadow-lg">
				<figure>
					<Image
						src="https://i.imgur.com/LyseZ4f.png"
						alt="Flippify desktop dashboard showing eBay store automation, inventory management system, and order fulfillment tools"
						width={1500}
						height={750}
						loading="lazy"
						className="rounded-3xl"
					/>
				</figure>
			</div>
		</div>
	);
};

export default HomeMockupBrowser;
