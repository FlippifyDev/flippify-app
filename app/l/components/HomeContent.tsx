import { Lato, Inter } from 'next/font/google';
import Image from 'next/image';
import GetEarlyAccess from './GetEarlyAccess';
import AboutFlippify from './AboutFlippify';
import PhoneMockup from './PhoneMockup';
import BrowserMockup from './BrowserMockup';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const HomeContent = ({ className = '' }) => {
  return (
    <div className={`home-details-container ${className}`}>
      <div className='flex flex-col items-center space-y-8'>
        <p className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1 text-center`}>
          Flipping
          <a className={`${inter.className} mb-8 text-white text-5xl font-bold`}> Made Easy.</a>
        </p>
        <p className='mb-8 text-greyText text-lg text-center m-2'>
          Providing An All-In-One Service Focused On Accelerating Your Reselling Profits.
        </p>
        <GetEarlyAccess />
        <AboutFlippify />
        <PhoneMockup />
        <BrowserMockup />
      </div>
    </div>
  );
};

export default HomeContent;
