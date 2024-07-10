import Image from "next/image";
import { Lato, Inter } from 'next/font/google';


const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const PhoneMockup = () => {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 pt-12">
      <div className="mockup-phone w-80">
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
      <div className="pt-6 md:pt-28 px-2">
      <p className={`${lato.className} text-4xl from-darkTextGradStart to-darkTextGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
          Instant
          <a className={`${inter.className} mb-8 text-headingDarkText text-4xl font-bold`}> Deals Right To Your Phone.</a>
        </p>
        <p className="pt-4 text-darkGreyText text-center font-semibold">
            Enjoy real-time alerts ensuring you never miss a deal with notifications right to your phone using our extremely fast discord bots.
        </p>
      </div>
    </div>
  );
};

export default PhoneMockup;
