import React, { useState } from 'react';

interface IElectronicsProduct {
  _id: string;
  productName: string;
  price: number;
  region: string;
  sku: string;
  retirementDate?: string; // Optional in case it doesn't exist
  image: string;
  link: string;
  website: string;
}

const PlansCardElectronics: React.FC<IElectronicsProduct> = ({
  _id,
  productName,
  price,
  region,
  sku,
  retirementDate,
  image,
  link,
  website,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = () => {
    // Handle "Buy Now" action if needed
    window.open(link, '_blank');
  };

  return (
    <div className="card w-96 shadow-xl">
      <figure>
        <img
          src={image || 'https://via.placeholder.com/300x200?text=No+Image+Available'}
          alt={productName}
          className="object-cover w-full h-48"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{productName}</h2>
        <h2>{productName}</h2>
        <p>Price: ${price?.toFixed(2) || 'N/A'}</p>
        <p>Region: {region}</p>
        <p>SKU: {sku}</p>
        {retirementDate && <p>Retirement Date: {retirementDate}</p>}
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

export default PlansCardElectronics;
