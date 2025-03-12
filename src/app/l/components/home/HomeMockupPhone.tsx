import Image from "next/image";
import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from "./HomeGetEarlyAccess";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeMockupPhone = () => {
	return (
		<div className="grid sm:grid-cols-1 md:grid-cols-2 pt-12 pb-8 md:pl-8">
			<div className="mockup-phone w-80 mockup-shadow">
				<div className="camera"></div>
				<div className="display">
					<figure>
						<Image
							src="https://i.imgur.com/Gt4tTNQ.png"
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
					Instant
					<a href="#" className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}> Deals Right To Your Phone.</a>
				</p>
				<p className="pt-4 text-lightModeText text-center font-semibold lg:w-4/5 mx-auto">
					Real-time alerts ensuring you never miss a deal with notifications right to your phone using our extremely fast bots.
				</p>
				<div className="flex justify-center pt-6">
					<HomeGetEarlyAccess />
				</div>
			</div>
		</div>
	);
};

export default HomeMockupPhone;


/*
	<div className="border grid sm:grid-cols-1 md:grid-cols-2 pt-12 pb-8 md:pl-8">
	  <div className="mockup-phone w-80 mockup-shadow">
		<div className="camera"></div>
		<div className="display">
		  <figure>
			<Image
			  src="https://i.ibb.co/wgp29vn/phone-mockup-image.jpg"
			  alt="Phone Mockup"
			  loading="lazy"
			  width={800}
			  height={500}
			/>
		  </figure>
		</div>
	  </div>
	  <div className="flex flex-col align-items justify-center mt-8 md:mt-0 sm:mr-24 sm:ml-24 md:ml-0 px-2">
		<p className={`${lato.className} text-4xl from-darkTextGradStart to-darkTextGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
		  Instant
		  <a className={`${inter.className} mb-8 text-headingDarkText text-4xl font-bold`}> Deals Right To Your Phone.</a>
		</p>
		<p className="pt-4 text-darkGreyText text-center font-semibold lg:w-4/5 mx-auto">
		  Real-time alerts ensuring you never miss a deal with notifications right to your phone using our extremely fast discord bots.
		</p>
		<div className="flex justify-center pt-6">
		  <GetEarlyAccess />
		</div>
	  </div>
	</div>
*/
