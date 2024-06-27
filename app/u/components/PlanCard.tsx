import React from 'react'
import BuyButton from './BuyButton';

interface PlanCardProps {
  image: string;
  title: string;
  description: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ image, title, description }) => {
  return (
      <div className="card bg-base-100 w-96 shadow-xl">
          <figure>
              <img src={image} alt={title} className="object-cover w-full h-60" />
          </figure>
          <div className="card-body">
              <h2 className="card-title">{title}</h2>
              <p>{description}</p>
              <div className="card-actions justify-end">
                  <BuyButton />
              </div>
          </div>
      </div>
  );
}

export default PlanCard
