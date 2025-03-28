import Image from "next/image";
import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from "./HomeGetAccess";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeMockupPhone = () => {
	return (
		<div className="grid sm:grid-cols-1 md:grid-cols-2 md:pl-8">
			<div className="mockup-phone w-80 mockup-shadow">
				<div className="camera"></div>
				<div className="display">
					<figure>
						<Image
                            src="https://i.imgur.com/QxSMWDB.jpeg"
							alt="Phone Mockup"
							loading="lazy"
							width={308}
							height={667}
						/>
					</figure>
				</div>
			</div>
			<div className="flex flex-col align-items justify-center mt-8 md:mt-0 sm:mr-24 sm:ml-24 md:ml-0 px-2">
				<p className={`${lato.className} text-4xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
                    <span className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}>Your </span>
					store
                    <span className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}> analytics right in your pocket.</span>
				</p>
				<p className="pt-4 text-lightModeText text-center font-semibold lg:w-4/5 mx-auto">
                    Effortlessly manage your eBay store with powerful insights and seamless inventory tracking, all in one place.
				</p>
				<div className="flex justify-center pt-6">
					<HomeGetEarlyAccess />
				</div>
			</div>
		</div>
	);
};

export default HomeMockupPhone;