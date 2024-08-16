// components/Card.tsx
import React, { useState } from 'react';

interface ILegoProduct {
  _id: string;
  productName: string;
  price: number;
  region: string;
  sku: string;
  retirementDate: string;
  image: string;
  link: string;
}

const LegoCard: React.FC<ILegoProduct> = ({
  _id,
  productName,
  price,
  region,
  sku,
  retirementDate,
  image,
  link,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = () => {
    // Handle "Buy Now" action if needed
    window.open(link, '_blank');
  };

  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <figure>
        <img
          src={image || 'https://banner2.cleanpng.com/20180402/kcw/avhg6z0it.webp'}
          alt={productName}
          className="object-cover w-full h-48"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{productName}</h2>
        <p>Price: ${price?.toFixed(2) || 'N/A'}</p>
        <p>Region: {region}</p>
        <p>SKU: {sku}</p>
        <p>Retirement Date: {retirementDate || 'Not recorded'}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          View Product
        </a>

        {/* Optional Error Display */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Optional Buy Now Button */}
        <button className="btn btn-primary mt-4" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default LegoCard;
