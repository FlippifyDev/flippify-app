import React from 'react';
import SubscribeNowButton from './SubscribeNowButton';
import Image from 'next/image';
import PriceStat from './PriceStat';

interface PlanCardProps {
  title: string;
  plans: number[];
  description: string;
  image: string;
  productId: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ title, plans = [], description, image, productId }) => {
  return (
    <div className="m-5 w-96 lg:w-4/5 xl:w-3/5">
      <div className="card lg:card-side bg-base-100 shadow-xl opacity-90">
        <figure className="w-full lg:w-1/3 max-w-96 min-w-54">
          <Image
            src={image}
            alt="Product Image"
            style={{ aspectRatio: '1' }}
            width={1000}
            height={1000}
          />
        </figure>
        <div className="card-body p-1">
          <div className="ml-2">
            <h2 className="card-title mb-1 text-2xl sm:text-xl md:text-xl lg:text-x">{title}</h2>
            <p className="text-wrap">{description}</p>
          </div>
          {plans.length > 0 && (
            <div className="my-auto">
              <PriceStat plans={plans} />
            </div>
          )}
          {plans.length > 0 && (
            <div className="card-actions justify-end">
              <SubscribeNowButton productId={productId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
