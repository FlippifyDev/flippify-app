import { Lato, Inter } from 'next/font/google';
import Image from 'next/image';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });


const GroupInformation = () => {
    const root = process.env.ROOT as string;

    return (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 md:pl-8">
            <div className="px-2 pt-6 pb-6 md:pt-0 md:pb-0 flex flex-col justify-center items-center">
                <p className={`${lato.className} text-4xl from-houseBlue to-houseHoverBlue to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
                    <a href="#" className={`${inter.className} mb-8 text-lightModeText text-4xl font-bold`}>Give your reselling group{" "}</a>
                    cheaper rates
                </p>
                <p className="pt-4 text-darkGreyText text-center font-semibold max-w-2xl ">
                    Contact us to get a personalised coupon code specific to your group. This will allow all members to get a discount on their subscription. We can also provide you with a referral link to track how many people from your group have signed up, earning you money at the same time.
                </p>
            </div>
            <div className="mockup-phone w-80 mockup-shadow">
                <div className="">
                    <figure>
                        <Image
                            src="https://i.imgur.com/wttHjxu.png"
                            alt="Phone Mockup"
                            className='rounded-4xl'
                            loading="lazy"
                            width={308}
                            height={667}
                        />
                    </figure>
                </div>
            </div>
        </div>
    )
}

export default GroupInformation
