import { Lato, Inter } from 'next/font/google';
import HomeGetEarlyAccess from './HomeGetEarlyAccess';
import HomeAbout from './HomeAbout';
import HomeMockupPhone from './HomeMockupPhone';
import HomeMockupBrowser from './HomeMockupBrowser';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeContent = ({ className = '' }) => {
  return (
    <div className={`home-details-container ${className}`}>
      <div className='flex flex-col items-center'>
        <div className="w-11/12 md:w-4/5 lg:w-3/5 xl:w-2/5">
          <p className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent text-center`}>
            Reselling
            <a href="#" className={`${inter.className} text-white text-5xl font-bold text-center`}> with cutting-edge bots and tools</a>
          </p>
        </div>
        <p className='w-11/12 sm:w-full mt-3 mb-8 pb-1 pt-2 text-greyText text-lg text-center'>
          Providing An All-In-One Service Focused On Accelerating Your Reselling Profits.
        </p>
        {/*
        <div className="flex items-center mb-3 pb-2">
            <span className="inline-block mr-2 text-grayText opacity-90 text-md">Connected with</span>
            <span><HomePoweredByCompanies /></span>
        </div>
        */}
        <HomeGetEarlyAccess />
        <HomeAbout />
        <HomeMockupPhone />
        <HomeMockupBrowser />
      </div>
    </div>
  );
};

export default HomeContent;
