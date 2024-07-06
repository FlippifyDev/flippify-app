import React from 'react';
import PriceCard from './PriceCard';

const PriceList = () => {
  return (
    <div className="flex flex-wrap justify-center xl:w-11/12 h-full mb-5 mt-5">
      <PriceCard
        title="Lego Retirement Deals"
        description="Monitors soon to retire lego sets across multiple websites."
        prices={[29.99, 24.99, 19.99]}
        priceIds={['price_1PYTiSJJRepiHZ8dZLk70VDe', 'price_2PYTiSJJRepiHZ8dZLk70VDe', 'price_3PYTiSJJRepiHZ8dZLk70VDe']} // Add the respective priceIds
        image="https://i.imgur.com/lOcRZPP.jpeg"
      />
      <PriceCard
        title="Coming Soon..."
        description="Many more deals coming your way shortly."
        prices={[]}
        priceIds={[]} // Add empty priceIds array for unavailable plans
        image="https://cdn.leonardo.ai/users/a47d5e66-3419-4c70-8651-b3e13a1a92ff/generations/38af42da-ec10-4e55-b788-ddb0e8d7b43d/Default_A_vibrant_masterpiece_rough_color_pencil_sketch_of_a_r_2.jpg"
      />
    </div>
  );
};

export default PriceList;
