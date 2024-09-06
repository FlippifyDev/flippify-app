import React from 'react';
import Image from 'next/image';
import { IDealWatch } from '@/app/api/monitors/dealWatchModel';
import Link from 'next/link';
import AnimationArrow from '../../../../components/AnimationArrow';

interface CardProps {
  product: IDealWatch;
}

const DealWatchCard: React.FC<CardProps> = ({ product }) => {
  // Price display logic
  const price = product.price !== undefined ? `£${product.price.toFixed(2)}` : "Not Found";
  const ebayMeanPrice = product.ebay_mean_price !== undefined ? `£${product.ebay_mean_price.toFixed(2)}` : "Not Found";
  const ebayMaxPrice = product.ebay_max_price !== undefined ? `£${product.ebay_max_price.toFixed(2)}` : "Not Found";

  return (
    <div className="grid grid-rows-10 bg-white shadow-lg rounded-lg overflow-hidden w-86 p-2 h-[32rem]">
      {/* Title Section */}
      <div className='row-span-3 grid grid-cols-12 p-2 gap-2'>
        <div className='col-span-8'>
          <h5 className='text-sm mb-2'>{product.website} {product.region.toUpperCase()}</h5>
          <h2 className='text-lg font-semibold'>{product.product_name}</h2>
        </div>
        <div tabIndex={0} role="button" className="flex items-start avatar col-span-4">
          <div className="w-24 rounded-lg border-2">
            <Image src={product.image} alt={product.product_name} width={500} height={500} />
          </div>
        </div>
      </div>

      <section className='row-span-7 flex flex-col justify-end'>
        {/* Table Section */}
        <div className="p-2">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td>{price}</td>
                </tr>
                <tr>
                  <td>eBay Mean Price</td>
                  <td>{ebayMeanPrice}</td>
                </tr>
                <tr>
                  <td>eBay Max Price</td>
                  <td>{ebayMaxPrice}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
                
        {/* Links Section */}
        <div className='flex flex-row px-1 sm:px-2'>
          <div className='w-7/12 sm:w-1/2'>
            <Link 
              href={`https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(product.product_name)}&_sacat=0&rt=nc&LH_Sold=1&LH_Complete=1`}
              target='_blank'
              className="flex justify-start text-blue-600 hover:text-blue-800 font-semibold text-sm px-3 py-2.5 text-center items-center"
            >
              eBay Sell History
            </Link>
          </div>

          <div className='w-5/12 sm:w-1/2 items-end'>
            <Link 
              href={product.link}
              target='_blank'
              className="relative flex justify-end text-blue-600 hover:text-blue-800 font-semibold text-sm px-3 py-2.5 text-center group"
            >
              <span className='mr-1'>Get Deal</span>
              <span><AnimationArrow /></span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DealWatchCard;
