"use client"
import { useEffect, useState } from 'react';
import { ILegoProduct } from 'app/api/products/productModel'; // Ensure the correct path to the ILegoProduct interface
import Card from 'app/u/components/PlansCardAdmin';

export default function lego() {
  const [legoProducts, setLegoProducts] = useState<ILegoProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLegoProducts() {
      try {
        const res = await fetch('/api/lego'); // Adjust the endpoint to fetch lego products
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        console.log('Fetched Lego products:', data); // Debug log
        setLegoProducts(data.products || []); // Default to empty array if `data.products` is undefined
      } catch (error) {
        console.error('Error fetching Lego products:', error);
        setError('Failed to fetch Lego products');
      }
    }

    fetchLegoProducts();
  }, []);

  return (
    <div style={styles.grid}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {legoProducts.length > 0 ? (
        legoProducts.map((product) => (
          <Card
            key={product._id}
            productName={product.productName}
            price={product.price}
            region={product.region}
            sku={product.sku}
            retirementDate={product.retirementDate}
            image={product.image}
            link={product.link}
            // Pass additional fields as needed
          />
        ))
      ) : (
        <p>No Lego products found.</p>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  } as React.CSSProperties,
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    width: '200px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
};
