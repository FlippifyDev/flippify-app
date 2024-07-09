import React from 'react';
import PriceCard from './PriceCard';
import { Lato, Inter } from 'next/font/google';

const lato = Lato({ weight: '900', style: 'italic', subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

const PriceList = () => {
  return (
    <div className="flex flex-wrap justify-center xl:w-11/12 h-full mb-5 mt-5">
      <div className='flex flex-col items-center space-y-5'>
        <p className={`${lato.className} text-5xl from-textGradStart to-textGradEnd to-60% bg-gradient-to-tr bg-clip-text text-transparent py-1`}>
          Pricing
          <a className={`${inter.className} mb-8 text-white text-5xl font-bold`}> Made Easy.</a>
        </p>
        <p className='mb-8 text-greyText text-lg'>
          Flippify is an all-in-one service meaning you get everything you need no matter what.
        </p>
        
      </div>
      <PriceCard
        title="Early Access"
        description="Gain access to our all-in-one service providing the best tools, bots and insights needed to accelerate your profits."
        prices={[34.99]}
        priceIds={['price_1PYTiSJJRepiHZ8dZLk70VDe', 'price_2PYTiSJJRepiHZ8dZLk70VDe', 'price_3PYTiSJJRepiHZ8dZLk70VDe']} // Add the respective priceIds
        image="https://i.imgur.com/lOcRZPP.jpeg"
      />
    </div>
  );
};

export default PriceList;
