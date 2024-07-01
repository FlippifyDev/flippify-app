import React from 'react'
import BuyButton from './BuyButton';
import Image from "next/image";

interface PlanCardProps {
  image: string;
  title: string;
  description: string;
  productId: string
}

const PlanCard: React.FC<PlanCardProps> = ({ image, title, description, productId }) => {
  return (
      <div className="card bg-base-100 shadow-xl flex flex-col transform transition-transform duration-160 hover:scale-105">
                <div className='h-60'>
            <figure className='relative'>
                    <Image src={image} alt={title} className="object-cover w-full h-auto" />
            </figure>
                </div>
            <div className="card-body flex flex-col flex-grow p-4">
                <h2 className="card-title">{title}</h2>
                <p className="flex-grow overflow-hidden">{description}</p>
                <div className="card-actions justify-end">
                    <BuyButton productId={productId}/>
                </div>
            </div>
      </div>
  );
}

export default PlanCard
