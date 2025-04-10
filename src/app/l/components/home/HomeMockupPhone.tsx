import Image from "next/image";
import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from "./HomeGetAccess";


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeMockupPhone = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between gap-6 max-w-6.5xl mx-auto p-2 md:p-0">
            <div className="flex justify-center">
                <figure className="border-2 border-white bg-gray-100/80 p-3 rounded-4xl shadow-lg">
                    <Image
                        src="https://i.imgur.com/w3ScSNI.jpeg"
                        alt="Flippify mobile interface displaying eBay seller dashboard, inventory tracking, and stock control tools"
                        className='rounded-3xl'
                        loading="lazy"
                        width={300}
                        height={300}
                    />
                </figure>
            </div>
            <div className="flex flex-col align-items justify-center mt-8 md:mt-0 sm:mr-12 sm:ml-12 md:ml-0 px-2">
                <p className={`${lato.className} text-4xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-start`}>
                    <span className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}>Your </span>
                    store
                    <span className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}> analytics right in your pocket.</span>
                </p>
                <p className="pt-4 text-lightModeText text-start font-semibold mx-auto">
                    Track inventory, orders, and performance from anywhere. Ideal for eBay sellers, dropshippers, and Shopify stores.
                </p>
                <div className="pt-6">
                    <HomeGetEarlyAccess />
                </div>
            </div>
        </div>
    );
};

export default HomeMockupPhone;