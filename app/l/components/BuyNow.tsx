import React from 'react';
import Link from 'next/link'

interface BuyNowProps {
  redirectURL: string;
}

const BuyNow: React.FC<BuyNowProps> = ({ redirectURL }) => {
  return (
    <div>
      <button className="btn btn-primary">
        <Link href={redirectURL}>Buy Now</Link>
      </button>
    </div>
  );
};

export default BuyNow;
