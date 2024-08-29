"use client"; // Marking this as a Client Component

import React, { useEffect, useState } from 'react';
import PlansCardElectronics from 'app/u/components/PlansCardElectronics';

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

const ElectronicsPage: React.FC = () => {
  const [electronicsProducts, setElectronicsProducts] = useState<IElectronicsProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchElectronicsProducts() {
      try {
        const res = await fetch('/api/deals-watch'); // Ensure the endpoint matches your API route
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        console.log('Fetched Electronics Products:', data.products); // Debug log
        setElectronicsProducts(data.products || []); // Default to empty array if `data.products` is undefined
      } catch (error) {
        console.error('Error fetching electronics products:', error);
        setError('Failed to fetch electronics products');
      }
    }

    fetchElectronicsProducts();
  }, []);

  return (
    <div style={styles.grid}>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {electronicsProducts.length > 0 ? (
      electronicsProducts
        .slice(0, 100) // Limit the number of products displayed to 100
        .map((product) => (
          <PlansCardElectronics
            key={product._id}
            _id={product._id}
            productName={product.productName}
            price={product.price}
            region={product.region}
            sku={product.sku}
            retirementDate={product.retirementDate}
            image={product.image}
            link={product.link}
            website={product.website}
          />
        ))
    ) : (
      <p>No products found.</p>
    )}
  </div>
  );
};

const styles = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  } as React.CSSProperties,
};

export default ElectronicsPage;
