import React from 'react'
import BuyButton from './BuyButton';

interface PlanCardProps {
  image: string;
  title: string;
  description: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ image, title, description }) => {
  return (
      <div className="card bg-base-100 w-96 shadow-xl flex flex-col transform transition-transform duration-300 hover:scale-105">
          <figure>
              <img src={image} alt={title} className="object-cover w-full h-60" />
          </figure>
          <div className="card-body flex flex-col flex-grow p-4">
              <h2 className="card-title">{title}</h2>
              <p className="flex-grow overflow-hidden">{description}</p>
              <div className="card-actions justify-end">
                  <BuyButton />
              </div>
          </div>
      </div>
  );
}

export default PlanCard
