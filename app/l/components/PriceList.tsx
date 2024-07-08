import React from 'react';
import PriceCard from './PriceCard';

const PriceList = () => {
  return (
    <div className="flex flex-wrap justify-center xl:w-11/12 h-full mb-5 mt-5 border">
      <PriceCard
        title="Standard Membership"
        description="Gain access to our all-in-one service providing the best tools, bots and insights needed to accelerate your profits."
        prices={[19.99, 16.99, 14.99]}
        priceIds={['price_1PYTiSJJRepiHZ8dZLk70VDe', 'price_2PYTiSJJRepiHZ8dZLk70VDe', 'price_3PYTiSJJRepiHZ8dZLk70VDe']} // Add the respective priceIds
        image="https://i.imgur.com/lOcRZPP.jpeg"
      />
    </div>
  );
};

export default PriceList;
