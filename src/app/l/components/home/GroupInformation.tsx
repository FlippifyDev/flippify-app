import { Lato, Inter } from 'next/font/google';
import Image from 'next/image';
import HomeGetAccess from './HomeGetAccess';
import Link from 'next/link';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });


const GroupInformation = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between gap-6 max-w-6.5xl mx-auto p-2 md:p-0">
            <div className="order-1 md:order-2 px-2 pt-6 pb-6 md:pt-0 md:pb-0 flex flex-col justify-center items-start">
                <p className={`${lato.className} text-4xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-start`}>
                    <a href="#" className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}>Give your reselling group{" "}</a>
                    cheaper rates
                </p>
                <p className="pt-4 text-darkGreyText text-start font-semibold max-w-2xl ">
                    Join our reselling community and unlock personalized discounts for your group. Share a unique referral link to track sign-ups and earn rewards while giving your members access to affordable Flippify subscriptions. <Link href="/l/partnerships" className="text-houseHoverBlue hover:underline">Find out more</Link>
                </p>
                <div className='mt-6'>
                    <HomeGetAccess />
                </div>
            </div>
            <figure>
                <Image
                    src="/home/partnership.svg"
                    alt="Flippify mobile app showing eBay reselling group discount and personalized coupon code features"
                    className='rounded-3xl'
                    loading="lazy"
                    width={500}
                    height={500}
                />
            </figure>
        </div>
    )
}

export default GroupInformation
